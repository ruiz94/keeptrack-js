import React, { useState, useEffect } from "react";
import { projectAPI } from "./projectAPI";
// import { MOCK_PROJECTS } from "./MockProjects";
import ProjectList from "./ProjectList";
import { Project } from "./Project";
import { NavLink, useLocation, useParams } from "react-router-dom";

const useProject = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(undefined);
  const [currentPage, setCurrentPage] = useState(1);

  const location = useLocation();
  // console.log(location, location.search);

  useEffect(() => {
    async function loadProjects() {
      setLoading(true);
      try {
        const data = await projectAPI.get(currentPage, location.search);
        setError(null);
        // setProjects(data);
        if (currentPage === 1) {
          setProjects(data);
        } else {
          setProjects((projects) => [...projects, ...data]);
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, [currentPage, location.search]);

  const saveProject = (project) => {
    projectAPI
      .put(project)
      .then((updatedProject) => {
        let updatedProjects = projects.map((p) => {
          return p.id === project.id ? new Project(updatedProject) : p;
        });
        setProjects(updatedProjects);
      })
      .catch((e) => {
        setError(e.message);
      });
  };
  const handleMoreClick = () => {
    setCurrentPage((currentPage) => currentPage + 1);
  };

  return { saveProject, handleMoreClick, projects, loading, error };
};

const ProjectsPage = () => {
  const { saveProject, handleMoreClick, projects, loading, error } =
    useProject();

  return (
    <>
      <div className="links-filters">
        <NavLink to={{ pathname: "/projects" }}>All</NavLink>
        <span className="line-divisor"></span>
        <NavLink to={{ pathname: "/projects", search: "?isActive=true" }}>
          Active
        </NavLink>
        <span className="line-divisor"></span>
        <NavLink to={{ pathname: "/projects", search: "?isActive=false" }}>
          InActive
        </NavLink>
      </div>
      <h1>Projects</h1>
      {error && (
        <div className="row">
          <div className="card large error">
            <section>
              <p>
                <span className="icon-alert inverse "></span>
                {error}
              </p>
            </section>
          </div>
        </div>
      )}
      <ProjectList projects={projects} onSave={saveProject} />
      {!loading && !error && (
        <div className="row">
          <div className="col-sm-12">
            <div className="button-group fluid">
              <button className="button default" onClick={handleMoreClick}>
                More...
              </button>
            </div>
          </div>
        </div>
      )}
      {loading && (
        <div className="center-page">
          <span className="spinner primary"></span>
          <p>Loading...</p>
        </div>
      )}
    </>
  );
};

export default ProjectsPage;
