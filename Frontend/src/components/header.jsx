import './header.css'

export function Header({ notesCount, onRandom, onNewest, onOldest }) {
  return (
    <header>
      <div className="title">
        <h1><i className="fa-solid fa-thumbtack"></i> Sticky Notes</h1>
      </div>

      <div className="tools">
        <span className="notes-count">{notesCount} Notes</span>
        <button className="random" onClick={onRandom}>random<i className="fa-solid fa-dice"></i></button>
        <button className="Newest" onClick={onNewest}>newest <i className="fa-solid fa-arrow-up"></i></button>
        <button className="oldest" onClick={onOldest}>oldest <i className="fa-solid fa-arrow-down"></i></button>
      </div>
    </header>
  )
}
