import './charSearch.scss'
import { Formik, Form, Field, ErrorMessage as FormikErrorMessage} from 'formik';
import useMarvelService from '../../services/MarvelService';
import { useState } from 'react';
import { Link } from 'react-router-dom'
import * as Yup from 'yup'
import ErrorMessage from '../errorMessage/ErrorMessage';


const CharSearch = () => {

    const [char, setChar] = useState(null)

    const {getCharacterByName, clearError, error, loading} = useMarvelService()

    const updateChar = (name) => {
        clearError()

        getCharacterByName(name)
            .then(onCharLoaded)
    }
    const onCharLoaded = (char) => {
        setChar(char);
    }
    
    const renderError = error ? <div className="char__search-critical-error"><ErrorMessage /></div> : null

    const result = !char ? null : char.length > 0 ? 
        <div className='char__search-success'>
            <div className="char__search-success-text">There is! Visit {char[0].name} page?</div>
            <Link to={`/character/${char[0].id}`} className="button button__secondary">
                <div className="inner">TO PAGE</div>
            </Link>
        </div> : 
        <div className="char__search-error">
            The character was not found. Check the name and try again
        </div>


    
    return (
        <div className="char__search">
            <Formik 
                initialValues={{name: ''}}
                validationSchema={Yup.object({
                    name : Yup.string().required('This field is required')
                })}
                onSubmit = { ({name}) => {
                    updateChar(name);
                }}
                >
                <Form className='char__search-form'>
                    <label className='char__search-label' htmlFor="name">Or find a character by name:</label>
                    <div className="char__search-wrapper">
                        <Field 
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Enter name"
                            />
                        <button 
                            type='submit'
                            disabled={loading}
                            className="button button__main">
                            <div className="inner">FIND</div>
                        </button>
                    </div>
                    <FormikErrorMessage className="char__search-error" name='name' component="div"/>
                </Form>            
            </Formik>
            {result}
            {renderError}
        </div>
    )
}

export default CharSearch