import React from "react"
import { useEffect, useState } from "react";
import api from '../../services/api';
import { useParams } from "react-router-dom";
import { Container, Owner, Loading, BackButton, IssuesList,PageActions, FilterButton } from "./styles";
import {FaArrowLeft} from 'react-icons/fa'
export default function Repositorio(){
    
    let {repositorio} =useParams()
    const [repo, setRepo] = useState({});
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState([
        {state: 'all', label: 'Todas', active: true},
        {state: 'open', label: 'Open', active: false},
        {state: 'closed', label: 'Fechadas', active: false}
    ]);
    const [filterIndex, setFilterIndex] = useState(0);


    //Buscando infos ao recarregar

    useEffect(() => {
        async function load(){
            const nomeRepo = repositorio;

            const [repositorioData, issuesData] = await Promise.all([
                api.get(`repos/${nomeRepo}`),
                api.get(`repos/${nomeRepo}/issues`, {
                    params: {
                        state: filters.find(f => f.active).state,
                        per_page: 5
                    }
                })

            ]);

            setRepo(repositorioData.data);
            setIssues(issuesData.data);
            setLoading(false);

            
        }

        load();

    }, [repositorio])


    useEffect(()=>{

        async function loadPages(){
            
            const nomeRepo = repositorio

            const response = await api.get(`/repos/${nomeRepo}/issues`, {
                params: {
                    state: filters[filterIndex].state,
                    page: page,
                    per_page: 5
                }
            })

            setIssues(response.data);

        }

        loadPages();

    }, [filters,filterIndex,page, repositorio])

    function handlePage(action){
        setPage( action === 'back' ? page - 1 : page + 1)
    }

    function handleFilter(index){
        setFilterIndex(index);
        console.log(filterIndex)
    }

    

    if(loading){
        return(
            <Loading>
                <h1>Carregando...</h1>
            </Loading>
        )
    }
    
    return(
        <Container>

            <BackButton to='/'>
                <FaArrowLeft color="#000" size={30}/>
            </BackButton>
          <Owner>
            <img src={repo.owner.avatar_url} alt={repo.owner.login}/>
            <h1>{repo.name}</h1>
            <p>{repo.description}</p>
          </Owner>

          <FilterButton active={filterIndex}>
               {filters.map((filter, index) => (
                <button type="button" key={filter.label} onClick={() => handleFilter(index)}>
                    {filter.label}
                </button>
               ))}
          </FilterButton>

          <IssuesList>
            {issues.map(issue =>(
                <li key={String(issue.id)}>
                    <img src={issue.user.avatar_url} alt={issue.user.login}/>
                    <div>
                        <strong>
                            <a href={issue.html_url}>{issue.title}</a>
                            {issue.labels.map(label =>(
                                <span key={String(label.id)}>{label.name}</span>
                            ))}
                        </strong>
                        <p>{issue.user.login}</p>
                    </div>
                </li>
            ))}
          </IssuesList>

          <PageActions>
            <button type="button" onClick={() => handlePage()}>Voltar</button>
            <button type="button" onClick={() => handlePage()}>Avancar</button>
          </PageActions>
        </Container>
    )
}