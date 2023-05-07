import Message from '../layout/Message';
import { useLocation } from 'react-router-dom';
import styles from './Projects.module.css';
import Container from '../layout/Container';
import LinkButton from '../layout/LinkButton';
import ProjectCard from '../project/ProjectCard';
import { useState, useEffect } from 'react';
import Loading from '../layout/Loading';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projectMessage, setProjectMessage] = useState('');
  const location = useLocation();

  useEffect(() => {
    const storedProjects = JSON.parse(localStorage.getItem('projects') || '[]');
    setProjects(storedProjects);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (location.state) {
      setProjectMessage(location.state.message);
    }
    const storedProjects = JSON.parse(localStorage.getItem('projects') || '[]');
    setProjects(storedProjects);
  }, [location.state]);

  function removeProject(id) {
    const updatedProjects = projects.filter((project) => project.id !== id);
    setProjects(updatedProjects);
    setProjectMessage('Projeto removido com sucesso!');
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
  }

  return (
    <div className={styles.project_container}>
      <div className={styles.title_container}>
        <h1>Projetos</h1>
        <LinkButton to="/newproject" text="Criar Projeto" />
      </div>
      {projectMessage && <Message type="success" msg={projectMessage} />}
      <Container customClass="start">
        {loading && <Loading />}
        {!loading && projects.length > 0 &&
          projects.map((project) => (
            <ProjectCard
              id={project.id}
              name={project.name}
              budget={project.budget}
              category={project?.category?.name}
              key={project.id}
              handleRemove={removeProject}
            />
          ))}
        {!loading && projects.length === 0 && <p>Não há projetos cadastrados!</p>}
      </Container>
    </div>
  );
}

export default Projects;
