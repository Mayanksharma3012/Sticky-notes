import { useState } from 'react';
import './wall.css'

export function Wall({ cards, onAddCard }) {
    const COLORS = ['Cream','Blush','Mist','Sage','Lilac','Wheat'];
    const STYLES = ['lined','plain','graph','dotted','dark'];

    const [After_Create_Btn, setAfter_Create_Btn] = useState(false)
    const [input, setInput] = useState('')
    const [selectedColor, setSelectedColor] = useState('Cream')
    const [selectedStyle, setSelectedStyle] = useState('lined')
    const [falling, isfalling] = useState(false)
    const [showError, setShowError] = useState(false)

    const panelClassName = `After-Create-btn ${After_Create_Btn || falling ? 'open' : ''} ${falling ? 'falling' : ''}`.trim();

    const closePanel = (event) => {
        event?.stopPropagation();
        if (!After_Create_Btn) return;

        isfalling(true);
        window.setTimeout(() => {
            setAfter_Create_Btn(false);
            isfalling(false);
        }, 450);
    };

    const handleColorClick = (event) => {
        const color = event.currentTarget.dataset.color;
        setSelectedColor(color);
    };

    const handleStyleClick = (event) => {
      const style = event.currentTarget.dataset.style;
      setSelectedStyle(style);
    }

    const handlePost = () => {
        if (!input.trim()) {
            setShowError(true)
            return
        }

        onAddCard({
            color: selectedColor,
            style: selectedStyle,
            text: input.trim(),
        })

        setInput('')
        closePanel()
    }

    return (
        <main>
            <div
                className="wall"
                onClick={(event) => {
                    if (After_Create_Btn && event.target === event.currentTarget) {
                        closePanel(event);
                    }
                }}
            >
                <div className={panelClassName} onClick={(event) => event.stopPropagation()}>
                    <div className="New-class" onClick={(event) => event.stopPropagation()}>
                        <h2><i className="fa-regular fa-note-sticky"></i>NEW NOTE</h2>

                            <p className='Color_name'>color</p>
                        <div className="Color-picker">
                            {COLORS.map((color) => (
                                    <div
                                        key={color}
                                        className={`color-dot color-${color} ${selectedColor === color ? 'selected' : ''}`}
                                        data-color={color}
                                        title={color}
                                        onClick={handleColorClick}
                                    />
                                ))}
                        </div>

                        <p className='Style_name'>style</p>
                        <div className="grid">
                            {STYLES.map((style) => (
                                <div
                                    key={style}
                                    className={`style ${style}  ${selectedStyle === style ? 'selected' : ''}`}
                                    data-style={style}
                                    title={style}
                                    onClick={handleStyleClick}
                                />
                            ))}
                        </div>

                        <textarea
                            className="inp"
                            maxLength="120"
                            placeholder="Type your note here...."
                            value={input}
                            onChange={(e) => {
                                setShowError(false);
                                setInput(e.target.value);
                            }}
                        ></textarea>

                        <span className="len-inp">{input.length} / 120</span>
                        <div className="empty">
                            {showError && <span>Please enter some text before Posting</span>}
                        </div>

                        <div className="btn-select">
                            <button className={falling ? 'falling cancel' : 'cancel'} onClick={closePanel}>Cancel</button>
                            <button className="post" onClick={handlePost}>
                                <i className="fa-solid fa-thumbtack"></i> Post It
                            </button>
                        </div>
                    </div>
                </div>

                {cards.map((card) => (
                    <div key={card.id || `${card.text}-${card.timestamp}`} className={`card ${card.color} ${card.style} ${card.tilt || 'tilt-normal'}`}>
                        <p>{card.text}</p>
                    </div>
                ))}
            </div>

            <div className="Create-btn">
                <button onClick={(e) => {
                    e.stopPropagation();
                    isfalling(false);
                    setAfter_Create_Btn(true);
                }}>+</button>
            </div>
        </main>
    )
}