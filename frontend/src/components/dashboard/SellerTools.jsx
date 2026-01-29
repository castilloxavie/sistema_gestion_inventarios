import React, { useState, useEffect } from 'react';
import { Calculator, StickyNote, X } from 'lucide-react';

export default function SellerTools() {
    const [showCalculator, setShowCalculator] = useState(false);
    const [showNotes, setShowNotes] = useState(false);
    const [display, setDisplay] = useState('0');
    const [previousValue, setPreviousValue] = useState(null);
    const [operation, setOperation] = useState(null);
    const [notes, setNotes] = useState(() => {
        const savedNotes = localStorage.getItem('sellerNotes');
        return savedNotes ? JSON.parse(savedNotes) : [];
    });
    const [newNote, setNewNote] = useState('');

    useEffect(() => {
        localStorage.setItem('sellerNotes', JSON.stringify(notes));
    }, [notes]);

    const handleNumber = (num) => {
        setDisplay(display === '0' ? num : display + num);
    };

    const handleOperation = (nextOperation) => {
        const inputValue = parseFloat(display);

        if (previousValue === null) {
            setPreviousValue(inputValue);
        } else if (operation) {
            const currentValue = previousValue || 0;
            const newValue = calculate(currentValue, inputValue, operation);
            setDisplay(String(newValue));
            setPreviousValue(newValue);
        }

        setOperation(nextOperation);
        setDisplay('0');
    };

    const calculate = (firstValue, secondValue, operation) => {
        switch (operation) {
            case '+':
                return firstValue + secondValue;
            case '-':
                return firstValue - secondValue;
            case '*':
                return firstValue * secondValue;
            case '/':
                return firstValue / secondValue;
            default:
                return secondValue;
        }
    };

    const handleEquals = () => {
        const inputValue = parseFloat(display);

        if (previousValue !== null && operation) {
            const newValue = calculate(previousValue, inputValue, operation);
            setDisplay(String(newValue));
            setPreviousValue(null);
            setOperation(null);
        }
    };

    const handleClear = () => {
        setDisplay('0');
        setPreviousValue(null);
        setOperation(null);
    };

    const addNote = () => {
        if (newNote.trim()) {
            const note = {
                id: Date.now(),
                content: newNote.trim(),
                timestamp: new Date().toLocaleString('es-ES')
            };
            setNotes([note, ...notes]);
            setNewNote('');
        }
    };

    const deleteNote = (id) => {
        setNotes(notes.filter(note => note.id !== id));
    };

    return (
        <div className="seller-tools">
            <div className="tools-header">
                <h3 className="tools-title">Herramientas de Trabajo</h3>
            </div>
            <div className="tools-grid">
                <button
                    className="tool-button"
                    onClick={() => setShowCalculator(!showCalculator)}
                >
                    <Calculator size={20} />
                    <span>Calculadora</span>
                </button>
                <button
                    className="tool-button"
                    onClick={() => setShowNotes(!showNotes)}
                >
                    <StickyNote size={20} />
                    <span>Notas</span>
                </button>
            </div>

            {showCalculator && (
                <div className="calculator-modal">
                    <div className="calculator-display">{display}</div>
                    <div className="calculator-buttons">
                        <button onClick={handleClear} className="clear-btn">C</button>
                        <button onClick={() => handleOperation('/')}>/</button>
                        <button onClick={() => handleOperation('*')}>*</button>
                        <button onClick={() => handleOperation('-')}>-</button>
                        <button onClick={() => handleNumber('7')}>7</button>
                        <button onClick={() => handleNumber('8')}>8</button>
                        <button onClick={() => handleNumber('9')}>9</button>
                        <button onClick={() => handleOperation('+')} className="span-2">+</button>
                        <button onClick={() => handleNumber('4')}>4</button>
                        <button onClick={() => handleNumber('5')}>5</button>
                        <button onClick={() => handleNumber('6')}>6</button>
                        <button onClick={() => handleNumber('1')}>1</button>
                        <button onClick={() => handleNumber('2')}>2</button>
                        <button onClick={() => handleNumber('3')}>3</button>
                        <button onClick={handleEquals} className="equals span-2">=</button>
                        <button onClick={() => handleNumber('0')} className="span-2">0</button>
                        <button onClick={() => handleNumber('.')}>.</button>
                    </div>
                </div>
            )}

            {showNotes && (
                <div className="notes-modal">
                    <div className="notes-input">
                        <textarea
                            placeholder="Escribe una nota..."
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            rows={3}
                        />
                        <button onClick={addNote} className="add-note-btn">
                            Agregar Nota
                        </button>
                    </div>
                    <div className="notes-list">
                        {notes.length > 0 ? (
                            notes.map(note => (
                                <div key={note.id} className="note-item">
                                    <div className="note-content">
                                        <p>{note.content}</p>
                                        <small>{note.timestamp}</small>
                                    </div>
                                    <button
                                        onClick={() => deleteNote(note.id)}
                                        className="delete-note-btn"
                                        title="Eliminar nota"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="no-notes">
                                No tienes notas guardadas.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
