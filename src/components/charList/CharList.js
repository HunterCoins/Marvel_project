import './charList.scss';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import PropTypes from 'prop-types';
import { useState, useEffect, useRef } from 'react';

const CharList = (props) => {

    const [charList, setCharList] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [newItemLoading, setNewItemLoading] = useState(false)
    const [offset, setOffset] = useState(210)
    const [charEnded, setCharEnded] = useState(false)  


    const marvelService = new MarvelService()

    useEffect(() => {
        onRequest()
    }, [])

    const onRequest = (offset) => {
        onCharListLoading()

        marvelService
            .getAllCharacters(offset)
            .then(onCharListLoaded)
            .catch(onError)
    }

    const onCharListLoading = () => {
        setNewItemLoading(true)
    }


    const onCharListLoaded = (newCharList) => {
        let ended = false
        if (newCharList.length < 9) {
            ended = true
        }

        setCharList(charList => [...charList, ...newCharList])
        setLoading(loading => false)
        setNewItemLoading(newItemLoading => false)
        setOffset(offset => offset + 9)
        setCharEnded(charEnded => ended)
    }

    const onError = () => {
        setError(true)
        setLoading(loading => false)
    }

    const itemRefs = useRef([])


    const focusOnItem = (id) => {
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'))
        itemRefs.current[id].classList.add('char__item_selected')
        itemRefs.current[id].focus()
    }

    function renderItems(arr) {
        const items = arr.map((item, i) => {
            let imgStyle = item.thumbnail.includes("not_available") ? 
            {"objectFit": "unset"} : 
            {"objectFit": "cover"}

            return (
                <li key={item.id}
                    ref={el => itemRefs.current[i] = el}
                    tabIndex='0'
                    className="char__item" 
                    onClick={() => {
                        props.onCharSelected(item.id)
                        focusOnItem(i)
                    }}
                    onKeyDown={(e) => {
                        if (e.key === ' ' || e.key === 'Enter') {
                            props.onCharSelected(item.id)
                            focusOnItem(i)
                        }
                    }}>
                    <img src={item.thumbnail} style={imgStyle} alt={item.name}/>
                    <div className="char__name">{item.name}</div>
                </li>
            )
        })

        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }
    
    const items = renderItems(charList)

    return (
        <div className="char__list">
            {loading ? <Spinner/> : error ? <ErrorMessage/> : items}
            <button  
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{'display': charEnded ? 'none' : 'block'}}
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}


export default CharList;