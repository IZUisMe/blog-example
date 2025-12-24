import { createSignal, onMount, onCleanup } from 'solid-js';

export default function DrawingCanvas() {
  let canvasRef;
  const [isDrawing, setIsDrawing] = createSignal(false);
  const [distance, setDistance] = createSignal(0);
  const [lastPos, setLastPos] = createSignal({ x: 0, y: 0 });
  
  // 描画開始
  const startDrawing = (e) => {
    if (e.target !== canvasRef) return;
    
    // スクロールを防ぐ
    if (e.type === 'touchstart') document.body.style.overflow = 'hidden';

    const { x, y } = getPos(e);
    setIsDrawing(true);
    setLastPos({ x, y });
    // setDistance(0); // 削除：距離をリセットせず合計し続ける
    
    const ctx = canvasRef.getContext('2d');
    // ctx.clearRect(...) // 削除：画面をクリアせず、前の線を残す
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = '#e9fe00'; // 👇 色を黄色(e9fe00)に変更
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  // 描画中
  const draw = (e) => {
    if (!isDrawing()) return;
    if(e.cancelable) e.preventDefault(); 

    const { x, y } = getPos(e);
    const ctx = canvasRef.getContext('2d');
    
    const d = Math.hypot(x - lastPos().x, y - lastPos().y);
    setDistance((prev) => prev + d);

    ctx.lineTo(x, y);
    ctx.stroke();
    setLastPos({ x, y });
  };

  // 描画終了
  const stopDrawing = () => {
    setIsDrawing(false);
    document.body.style.overflow = '';
  };

  const getPos = (e) => {
    if (e.touches && e.touches.length > 0) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
  };

  const resize = () => {
    // リサイズ時はキャンバスの中身が消えてしまうため、
    // ここで保存・復元するロジックを入れるのが理想ですが、
    // 今回は簡易的にサイズ調整のみ行います
    if (canvasRef) {
      // 既存の描画内容を一時保存
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      tempCanvas.width = canvasRef.width;
      tempCanvas.height = canvasRef.height;
      tempCtx.drawImage(canvasRef, 0, 0);

      // サイズ変更
      canvasRef.width = window.innerWidth;
      canvasRef.height = window.innerHeight;

      // 復元
      const ctx = canvasRef.getContext('2d');
      ctx.drawImage(tempCanvas, 0, 0);
    }
  };

  onMount(() => {
    // 初期サイズ設定
    if (canvasRef) {
      canvasRef.width = window.innerWidth;
      canvasRef.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    
    window.addEventListener('mousedown', startDrawing);
    window.addEventListener('mousemove', draw);
    window.addEventListener('mouseup', stopDrawing);
    
    canvasRef.addEventListener('touchstart', startDrawing, { passive: false });
    canvasRef.addEventListener('touchmove', draw, { passive: false });
    canvasRef.addEventListener('touchend', stopDrawing);
  });

  onCleanup(() => {
    window.removeEventListener('resize', resize);
    window.removeEventListener('mousedown', startDrawing);
    window.removeEventListener('mousemove', draw);
    window.removeEventListener('mouseup', stopDrawing);
  });

  return (
    <>
      <canvas
        ref={canvasRef}
        class="fixed inset-0 z-0 touch-none cursor-crosshair bg-[#9aa0a9]"
      />
      
      {/* 距離の表示ラベル */}
      {distance() > 0 && (
        <div
          // 👇 スタイル調整: 色変更、サイズ小さく(text-xs), 字間広げる(tracking-[0.2em])
          class="fixed pointer-events-none text-[#e9fe00] font-pixel text-xs tracking-[0.2em] font-bold drop-shadow-md transition-opacity duration-300"
          style={{
            top: `${lastPos().y - 30}px`, // 位置を少し調整
            left: `${lastPos().x}px`,
            transform: 'translateX(-50%)',
            opacity: isDrawing() ? 1 : 0 // 描いていないときは隠す（お好みで調整可）
          }}
        >
          {Math.floor(distance() / 5)}m
        </div>
      )}
    </>
  );
}