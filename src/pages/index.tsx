// src/pages/index.tsx

import React, { useState } from 'react';

const Home: React.FC = () => {
  const [hasError, setHasError] = useState(false);

  const handleClick = () => {
    alert("ボタンがクリックされました");
    setHasError(true);
  };

  if (hasError) {
    throw new Error("テストエラー");
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <button
        onClick={handleClick}
        className="px-4 py-2 bg-red-500 text-white rounded"
      >
        エラーを発生させる
      </button>
    </div>
  );
};

export default Home;
