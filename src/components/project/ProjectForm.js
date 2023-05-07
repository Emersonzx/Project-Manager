import { useEffect, useState } from 'react';
import styles from './ProjectForm.module.css';
import Input from '../form/Input';
import Select from '../form/Select';
import SubmitButton from '../form/SubmitButton';

function ProjectForm({ handleSubmit, btnText, projectData }) {
  const [categories, setCategories] = useState(
    JSON.parse(localStorage.getItem('categories')) || []
  );
  const [project, setProject] = useState(projectData || {});

  const submit = (e) => {
    e.preventDefault();
    handleSubmit(project);
  };

  function handleChange(e) {
    setProject({ ...project, [e.target.name]: e.target.value });
  }

  function handleCategory(e) {
    setProject({
      ...project,
      category: {
        id: e.target.value,
        name: e.target.options[e.target.selectedIndex].text,
      },
    });
  }

  useEffect(() => {
    const categoriesFromStorage = JSON.parse(
      localStorage.getItem('categories')
    );

    if (categoriesFromStorage && categoriesFromStorage.length > 0) {
      setCategories(categoriesFromStorage);
    } else {
      const categoriesData = [
        {
          id: 1,
          name: "Infra",
        },
        {
          id: 2,
          name: "Desenvolvimento",
        },
        {
          id: 3,
          name: "Design",
        },
        {
          id: 4,
          name: "Planejamento",
        },
      ];
      

      localStorage.setItem('categories', JSON.stringify(categoriesData));
      setCategories(categoriesData);
    }
  }, []);

  return (
    <form onSubmit={submit} className={styles.form}>
      <Input
        type="text" required
        text="Nome do projeto"
        name="name"
        placeholder="Insira o nome do projeto"
        handleOnChange={handleChange}
        value={project.name ? project.name : ''}
      />
      <Input
        type="number" required
        text="Orçamento do projeto"
        name="budget"
        placeholder="Insira o orçamento total"
        handleOnChange={handleChange}
        value={project.budget ? project.budget : ''}
      />
      <Select
        name="category_id"
        text="Selecione a categoria"
        options={categories}
        handleOnChange={handleCategory}
        value={project.category ? project.category.id : ''}
      />
      <SubmitButton text={btnText} />
    </form>
  );
}

export default ProjectForm;
