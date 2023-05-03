import styles from './Project.module.css';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Loading from '../layout/Loading';
import Container from '../layout/Container';
import ProjectForm from '../project/ProjectForm';
import Message from '../layout/Message';
import ServiceForm from '../service/ServiceForm';
import { v4 as uuidv4 } from 'uuid';
import ServiceCard from '../service/ServiceCard';
import {  doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';

function Project() {
  const { id } = useParams();

  const [project, setProject] = useState({});
  const [services, setServices] = useState([]);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState('');
  const [showServiceForm, setShowServiceForm] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      const projectDoc = doc(db, 'projects', id);
      const projectData = await getDoc(projectDoc);
      if (projectData.exists()) {
        setProject(projectData.data());
        setServices(projectData.data().services || []);
      }
    };
    fetchProject();
  }, [id]);

  function editPost(project) {
    setMessage('');
    if (project.budget < project.cost) {
      setMessage('O orçamento não pode ser menor que o custo do projeto!');
      setType('error');
      return false;
    }

    const projectRef = doc(db, 'projects', id);
    updateDoc(projectRef, project)
      .then(() => {
        setProject(project);
        setShowProjectForm(false);
        setMessage('Projeto atualizado');
        setType('success');
      })
      .catch((err) => console.log(err));
  }

  function createService(project) {
    setMessage('');
  
    const lastService = project.services[project.services.length - 1];
    
    lastService.id = uuidv4();
  
    const lastServiceCost = lastService.cost || 0;
    const newCost = parseFloat(project.cost || 0) + parseFloat(lastServiceCost);
  
    if (newCost > parseFloat(project.budget)) {
      setMessage('Orçamento ultrapassado, verifique o valor do serviço');
      setType('error');
      project.services.pop();
      return false;
    }
  project.cost = newCost
  
  const projectRef = doc(db, 'projects', id);
  updateDoc(projectRef, project)
    .then(() => {
      const serviceAlreadyExists = services.some(service => service.id === lastService.id);
      if (!serviceAlreadyExists) {
        const newServices = [...services, lastService];
        setServices(newServices);
      }
      
      setProject({...project, cost: newCost}); 
      
      setShowServiceForm(false);
    })
    .catch((err) => console.log(err));
  
  }
  
  const projectId = id
  
  function removeService(id, cost) {
    
    const servicesUpdated = project.services.filter(
      (service) => service.id !== id
    );
    
    const projectUpdated = { ...project, services: servicesUpdated };

   
    projectUpdated.cost =
      parseFloat(projectUpdated.cost) - parseFloat(cost);

      if (projectUpdated.cost <= 0) {
        projectUpdated.cost = 0;
      }

    const projectRef = doc(db, 'projects', projectId);
    
    
    updateDoc(projectRef, projectUpdated)
    .then(() => {
      setProject(projectUpdated);
      setServices(servicesUpdated);
      setMessage('Serviço removido com sucesso!');
    })
    .catch((err) => console.log(err));

}
  

  function toggleProjectForm() {
    setShowProjectForm(!showProjectForm);
  }
  function toggleServiceForm() {
    setShowServiceForm(!showServiceForm);
  }

  return (
    <>{project.name? (
    <div className={styles.project_details}>
        <Container customClass="column"> 
        {message && <Message type={type} msg={message}/>}
    <div className={styles.details_container}>
        <h1>Projeto: {project.name}</h1>
    <button className={styles.btn} onClick={toggleProjectForm}>
        {!showProjectForm? 'Editar projeto' : 'Fechar'}
        </button>
        {!showProjectForm? (
        <div className={styles.project_info}>{project.category && (
          <p>
            <span>Categoria:</span> {project.category.name}
          </p>
        )}
            <p><span>Total de Orçamento:</span> R${project.budget}</p>
            <p><span>Total Utilizado:</span> R${project.cost}</p>
        </div>): (
            <div  className={styles.project_info}>
                <ProjectForm handleSubmit={editPost} btnText="Concluir edição" projectData={project}/>
            </div>

         )}
    </div>
    <div className={styles.service_form_container}> 
<h2>Adicione um serviço:</h2>
<button className={styles.btn} onClick={toggleServiceForm}>
        {!showServiceForm? 'Adicionar serviço' : 'Fechar'} 
        </button>
        <div className={styles.project_info}>
            {showServiceForm && (<ServiceForm
            handleSubmit={createService}
            btnText="Adicionar serviço"
            projectData={project}/>)} 
        </div>
        </div>
        <h2>Serviços</h2>
        <Container customClass="start">
            {services.length > 0 &&
            services.map((service) => (
                <ServiceCard
                id={service.id}
                name={service.name}
                cost={service.cost}
                description={service.description}
                key={service.id}
                handleRemove={removeService}
                />
            )
            )
            }
            {
                services.length === 0 && <p>Não há serviços cadastrados</p>
            }
        </Container>
    </Container></div>) 
    :(<Loading/>)} </>
    )
}

export default Project