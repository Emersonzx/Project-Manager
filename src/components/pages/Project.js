import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import styles from './Project.module.css';
import Loading from '../layout/Loading';
import Container from '../layout/Container';
import ProjectForm from '../project/ProjectForm';
import Message from '../layout/Message';
import ServiceForm from '../service/ServiceForm';
import ServiceCard from '../service/ServiceCard';

function Project() {
  const { id } = useParams();

  const [project, setProject] = useState({});
  const [services, setServices] = useState([]);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState('');
  const [showServiceForm, setShowServiceForm] = useState(false);

  useEffect(() => {
    const projectData = JSON.parse(localStorage.getItem('projects')) || [];
    const foundProject = projectData.find((proj) => proj.id === id);
    if (foundProject) {
      setProject(foundProject);
      setServices(foundProject.services || []);
    }
  }, [id]);

  function editPost(project) {
    if (project.budget < project.cost) {
      setMessage('O orçamento não pode ser menor que o custo do projeto!');
      setType('error');
      return false;
    }
  
    const projectData = JSON.parse(localStorage.getItem('projects')) || [];
    const updatedProjects = projectData.map((proj) => {
      if (proj.id === id) {
        return project;
      } else {
        return proj;
      }
    });
    
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    setProject(project);
    setShowProjectForm(false);
    setMessage('Projeto atualizado');
    setType('success');
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
    
    const newServices = [...services, lastService];
    setServices(newServices);
    setProject({...project, cost: newCost}); 
    setShowServiceForm(false);
  
    const projectData = JSON.parse(localStorage.getItem('projects')) || [];
    const updatedProjects = projectData.map((proj) => {
      if (proj.id === project.id) {
        return {...project, services: newServices};
      } else {
        return proj;
      }
    });
    
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
  }
  

  function removeService(id, cost) {
    const updatedServices = services.filter((service) => service.id !== id);
    const updatedProject = { ...project, services: updatedServices };
    updatedProject.cost = parseFloat(updatedProject.cost) - parseFloat(cost) || 0;
    const projectData = JSON.parse(localStorage.getItem('projects')) || [];
    const updatedProjects = projectData.map((proj) => {
      if (proj.id === project.id) {
        return updatedProject;
      } else {
        return proj;
      }
    });
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    setServices(updatedServices);
    setProject(updatedProject);
    setMessage('Serviço removido com sucesso!');
  }
  

  function toggleProjectForm() {
    setShowProjectForm(!showProjectForm);
  }

  function toggleServiceForm() {
    setShowServiceForm(!showServiceForm);
  }


  return (
    <>
    {project.name ? (
      <div className={styles.project_details}>
        <Container customClass="column">
          {message && <Message type={type} msg={message} />}
          <div className={styles.details_container}>
            <h1>Projeto: {project.name}</h1>
            <button className={styles.btn} onClick={toggleProjectForm}>
              {!showProjectForm ? 'Editar projeto' : 'Fechar'}
            </button>
            {!showProjectForm ? (
              <div className={styles.project_info}>
                {project.category && (
                  <p>
                    <span>Categoria:</span> {project.category.name}
                  </p>
                )}
                <p>
                  <span>Total de Orçamento:</span> R${project.budget}
                </p>
                <p>
                  <span>Total Utilizado:</span> R${project.cost}
                </p>
              </div>
            ) : (
              <div className={styles.project_info}>
                <ProjectForm
                  handleSubmit={editPost}
                  btnText="Concluir edição"
                  projectData={project}
                />
              </div>
            )}
          </div>
          <div className={styles.service_form_container}>
            <h2>Adicione um serviço:</h2>
            <button className={styles.btn} onClick={toggleServiceForm}>
              {!showServiceForm ? 'Adicionar serviço' : 'Fechar'}
            </button>
            <div className={styles.project_info}>
              {showServiceForm && (
                <ServiceForm
                  handleSubmit={createService}
                  btnText="Adicionar serviço"
                  projectData={project}
                />
              )}
            </div>
          </div>
          <h2>Serviços</h2>
          <Container customClass="start">
            {services.length > 0 &&
              services.map((service) => (
                <ServiceCard
                  id={service.id}
                  name={service.name}
                  description={service.description}
                  cost={service.cost}
                  key={service.id}
                  handleRemove={() => removeService(service.id, service.cost)}
                />
              ))}
          </Container>
        </Container>
      </div>
    ) : (
      <Loading />
    )}
  </>
  )
}
export default Project  