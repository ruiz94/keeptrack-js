import PropType from "prop-types";
import { useState } from "react";
import { Project } from "./Project";
import ProjectCard from "./ProjectCard";
import ProjectForm from "./ProjectForm";

const ProjectList = ({ projects, onSave }) => {
  const [projectBeingEdited, setProjectBeingEdited] = useState({});
  const handleEdit = (project) => {
    setProjectBeingEdited(project);
  };
  const cancelEditing = () => {
    setProjectBeingEdited({});
  };

  return (
    <ul className="row">
      {projects.map((project) => (
        <div key={project.id} className="cols-sm">
          {project === projectBeingEdited ? (
            <ProjectForm project={project} onCancel={cancelEditing} onSave={onSave} />
          ) : (
            <ProjectCard project={project} onEdit={handleEdit} />
          )}
        </div>
      ))}
    </ul>
  );
};

ProjectList.propType = {
  projects: PropType.arrayOf(PropType.instanceOf(Project)),
  onSave: PropType.func.isRequired,
};

export default ProjectList;
