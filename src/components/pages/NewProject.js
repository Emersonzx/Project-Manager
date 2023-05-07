import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProjectForm from '../project/ProjectForm';
import { v4 as uuidv4 } from 'uuid'; 

import styles from './NewProject.module.css';

function NewProject() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (project) => {
    setIsSubmitting(true);

    try {
      const projects = JSON.parse(localStorage.getItem('projects')) || [];
    
      
      const id = uuidv4();
      const newProject = { ...project, id };
      const updatedProjects = [...projects, newProject];
      localStorage.setItem('projects', JSON.stringify(updatedProjects));
      
      
      navigate('/projects', { state: { message: 'Projeto criado com sucesso!' } });
    } catch (error) {
      console.error('Error creating project:', error);
      setError('Ocorreu um erro ao criar o projeto. Por favor, tente novamente mais tarde.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.newproject_container}>
      <h1>Criar Projeto</h1>
      <p>Crie seu projeto para depois adicionar os serviços</p>
      <ProjectForm handleSubmit={handleSubmit} btnText="Criar projeto" isSubmitting={isSubmitting} />
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
}

export default NewProject;
