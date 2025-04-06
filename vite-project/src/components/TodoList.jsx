// import './TodoList.css';

// function TodoList({ items, onEdit, onDelete }) {
//   return (
//     <div className="todo-wrapper">
//       <h2>📝 ToDoリスト</h2>
//       <ul className="todo-list">
//         {items.map((item) => (
//           <li key={item.id}>
//             {/* ✅ チェック状態と時間を表示 */}
//             <label>
//               <input
//                 type="checkbox"
//                 checked={item.IsCheacked}
//                 readOnly // 編集はここではできない
//               />
//               <span style={{ textDecoration: item.IsCheacked ? 'line-through' : 'none' }}>
//                 {item.name}
//               </span>
//               {item.Time && (
//                 <span style={{ marginLeft: '1rem', fontSize: '0.9rem', color: '#888' }}>
//                   ⏰ {item.Time}
//                 </span>
//               )}
//             </label>
//             <button onClick={() => onEdit(item)}>編集</button>
//             <button onClick={() => onDelete(item.id)}>削除</button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default TodoList;
import { useEffect, useState } from 'react';
import './TodoList.css';

function TodoList({ items, onEdit, onDelete }) {
  const [remainingTimes, setRemainingTimes] = useState({});

  // 残り時間を計算する関数
  const getTimeRemaining = (dateStr, timeStr) => {
    if (!dateStr || !timeStr || !/^\d{2}:\d{2}$/.test(timeStr)) return '';

    const deadline = new Date(`${dateStr}T${timeStr}:00`);
    const now = new Date();
    const diff = deadline - now;

    if (diff <= 0) return '⏳ 予定は開始しています。';

    const seconds = Math.floor((diff / 1000) % 60);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    return `⏳ あと${days}日${hours}時間${minutes}分${seconds}秒`;
  };

  // 毎秒ごとに全てのTODOの残り時間を更新する
  useEffect(() => {
    const interval = setInterval(() => {
      const updatedTimes = {};
      for (const item of items) {
        updatedTimes[item.id] = getTimeRemaining(item.date, item.Time);
      }
      setRemainingTimes(updatedTimes);
    }, 1000);

    return () => clearInterval(interval); // コンポーネントのクリーンアップ
  }, [items]);

  return (
    <div className="todo-wrapper">
      <h2>📝 ToDoリスト</h2>
      <ul className="todo-list">
        {items.map((item) => (
          <li key={item.id} className="todo-item">
            <div className="todo-content">
              <label>
                <input type="checkbox" checked={item.IsCheacked} readOnly />
                <span style={{ textDecoration: item.IsCheacked ? 'line-through' : 'none' }}>
                  {item.name}
                </span>
                {item.Time && (
                  <>
                    <span style={{ marginLeft: '1rem', fontSize: '0.9rem', color: '#888' }}>
                      ⏰ {item.Time}
                    </span>
                    <span style={{ marginLeft: '1rem', fontSize: '0.9rem', color: '#555' }}>
                      {remainingTimes[item.id]}
                    </span>
                  </>
                )}
              </label>
            </div>
            <div className="todo-actions">
              <button onClick={() => onEdit(item)}>編集</button>
              <button onClick={() => onDelete(item.id)}>削除</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
