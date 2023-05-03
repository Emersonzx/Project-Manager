import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import styles from './NewProject.module.css';
import ProjectForm from '../project/ProjectForm';
import { useNavigate } from 'react-router-dom';
import {  db } from '../firebase/firebase';

function NewProject() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (project) => {
    setIsSubmitting(true);

    try {
      
      const projectsCollectionRef = collection(db, 'projects');
      const newDocRef = await addDoc(projectsCollectionRef, project);
      console.log(`New project created with ID: ${newDocRef.id}`);
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
