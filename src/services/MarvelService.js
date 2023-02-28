import { useHttp } from "../hooks/http.hook";

const useMarvelService = () => {
    const {loading, request, error, clearError} = useHttp()

    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=0b0a857203ab6b59a9316e57fb507460';
    const _baseOffset = 210;


    const getAllCharacters = async (offset = _baseOffset) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformCharacter);
    }
    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    }
    const getAllComics = async (offset = _baseOffset) => {
        const res = await request(`${_apiBase}comics?limit=8&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformComics);
    }
    const getComic = async (id) => {
        const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
        return _transformComics(res.data.results[0]);
    }
    const getCharacterByName = async (name) => {
        const res = await request(`${_apiBase}characters?name=${name}&${_apiKey}`)
        return res.data.results.map(_transformCharacter);
    }

    const _transformCharacter = (char) => {
        return {
            name: char.name,
            description: char.description ? char.description : "There is no available data about this character.",
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            id: char.id,
            comics: char.comics.items.slice(10)
        }
    }
    const _transformComics = (comic) => {
        return {
            title: comic.title,
            description: comic.description || "There is no available data about this character.",
            thumbnail: comic.thumbnail.path + '.' + comic.thumbnail.extension,
            id: comic.id,
            pages: comic.pageCount ? `${comic.pageCount} p.` : "No information about the number of pages",
            language: comic.textObjects[0]?.language || "en-us",
            price: comic.prices[0].price
				? `${comic.prices[0].price}$`
				: "not available"
        }
    } 

    return {loading, error, getAllCharacters, getCharacter, getAllComics, getComic, clearError, getCharacterByName}
}

export default useMarvelService;