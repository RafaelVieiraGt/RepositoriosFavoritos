import React, {useState, useCallback, useEffect} from "react"
import {Container, Form, SubmitButton, List, DeleteButton} from './styles'
import {FaGithub, FaPlus, FaSpinner, FaBars, FaTrash} from 'react-icons/fa';
import api from "../../services/api";

import { Link } from "react-router-dom";


export default function Main(){

    const [newRepo, setNewRepo] = useState("");
    const [repositorios, setRepositorios] = useState([]);
    const [loading, setLoading] =useState(false);
    const [alert, setAlert] = useState(null);
    //did amount 
    useEffect(()=>{

        const repoStorage = localStorage.getItem('repos');
        if(repoStorage){
            setRepositorios(JSON.parse(repoStorage))
        }

    },[])

    //did update

    useEffect(()=>{
        localStorage.setItem('repos', JSON.stringify(repositorios));
    },[repositorios])

    function handleInputChange(e){
        setNewRepo(e.target.value)
        setAlert(null)
    }

    const handleSubmit = useCallback((e) => {

        e.preventDefault()
        async function submit(){
            setLoading(true);
            setAlert(null);

            try{

                if(newRepo === ''){
                    throw new Error('Insira um valor para realizar a busca!')
                }
            const response = await api.get(`repos/${newRepo}`)

            const hasRepo = repositorios.find(repo=> repo.name === newRepo);

            if(hasRepo){
                throw new Error('Repositorio duplicado')
            }

            const data = {
                name: response.data.full_name
            }
            setRepositorios([...repositorios, data])
            setNewRepo('')
            }catch(error){
                setAlert(true);
                console.log(error);
            }finally{
                setLoading(false);
            }
            
        }

        submit();

    }, [newRepo, repositorios])

       
    const handleDelete = useCallback((repo)=>{
        const find = repositorios.filter(r => r.name !== repo)

        setRepositorios(find);
    }, [repositorios])
    
    return(
        <div>
            <Container>
                <FaGithub size={25}/>
                <h1>Meus repositorios</h1>

               <Form onSubmit={handleSubmit} error={alert}>
                <input 
                type="text" 
                placeholder="Adicionar Repositorios"
                value={newRepo}
                onChange={handleInputChange}/>

                <SubmitButton loading={loading ? 1 : 0}>
                    {loading ? (
                        <FaSpinner color="#fff" size={14}/>
                    ) : (
                        <FaPlus size={14} color="#fff"/>
                    )}
                    
                </SubmitButton>
               </Form>

               <List>
                    {repositorios.map(repo => (
                        <li key={repo.name}>
                            <span>
                                <DeleteButton onClick={()=>handleDelete(repo.name)}>
                                    <FaTrash size={14}/>
                                </DeleteButton>
                                {repo.name}
                            </span>
                            <Link to={`/repositorio/${encodeURIComponent(repo.name)}`}><FaBars size={20}/></Link>
                        </li>
                    ))}
                
               </List>
            </Container>
            
        </div>
    )
}