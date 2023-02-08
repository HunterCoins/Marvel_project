import './charList.scss';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import PropTypes from 'prop-types';
import { Component } from 'react';

class CharList extends Component {
    constructor(props) {
        super(props)
        console.log('constructor')
    }

    state = {
       charList: [],
       loading: true,
       error: false,
       newItemLoading: false,
       offset: 210,
       charEnded: false
    }

    marvelService = new MarvelService()

    componentDidMount() {
        console.log('mounted')

        this.onRequest()
    }
    componentDidUpdate() {
        console.log('updated')
    }

    onRequest = (offset) => {
        this.onCharListLoading()

        this.marvelService
            .getAllCharacters(offset)
            .then(this.onCharListLoaded)
            .catch(this.onError)
    }

    onCharListLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }


    onCharListLoaded = (newCharList) => {
        let ended = false
        if (newCharList.length < 9) {
            ended = true
        }

        this.setState(({charList, offset}) => ({
                charList: [...charList, ...newCharList],
                loading: false,
                newItemLoading: false,
                offset: offset + 9,
                charEnded: ended
        }))
    }

    onError = () => {
        this.setState({
            error: true,
            loading: false
        })
    }

    itemRefs = []

    setRef = ref => {
        this.itemRefs.push(ref)       
    }

    focusOnItem = (id) => {
        this.itemRefs.forEach(item => item.classList.remove('char__item_selected'))
        this.itemRefs[id].classList.add('char__item_selected')
        this.itemRefs[id].focus()
    }

    renderItems(arr) {
        const items = arr.map((item, i) => {
            let imgStyle = item.thumbnail.includes("not_available") ? 
            {"objectFit": "unset"} : 
            {"objectFit": "cover"}

            return (
                <li key={item.id}
                    ref={this.setRef}
                    tabIndex='0'
                    className="char__item" 
                    onClick={() => {
                        this.props.onCharSelected(item.id)
                        this.focusOnItem(i)
                    }}
                    onKeyDown={(e) => {
                        if (e.key === ' ' || e.key === 'Enter') {
                            this.props.onCharSelected(item.id)
                            this.focusOnItem(i)
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


    render() {
        console.log('render')

        const {charList, loading, error, offset, newItemLoading, charEnded} = this.state
        
        const items = this.renderItems(charList)

        return (
            <div className="char__list">
                {loading ? <Spinner/> : error ? <ErrorMessage/> : items}
                <button  
                    className="button button__main button__long"
                    disabled={newItemLoading}
                    style={{'display': charEnded ? 'none' : 'block'}}
                    onClick={() => this.onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}


export default CharList;