import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Problems.css';
import { useNavigate } from 'react-router-dom';

const Problems = () => {
  const [problems, setProblems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await axios.get('https://rishuharsh.xyz:3000/problems');
        setProblems(res.data);
      } catch (error) {
        console.error("Error fetching problems:", error);
      }
    };
    fetchProblems();
  }, []);

  const handleClick = (id) => {
    navigate(`/compiler/${id}`);
  };

  return (
    <div className="problems-page">
      <div className="problems-container">
        <h2 className="problems-title">All Problems</h2>
        <table className="problems-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Difficulty</th>
            </tr>
          </thead>
          <tbody>
            {problems.map((problem) => (
              <tr
                key={problem._id}
                className="clickable-row"
                onClick={() => handleClick(problem._id)}
              >
                <td>{problem.title}</td>
                <td className={problem.difficulty.toLowerCase()}>{problem.difficulty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Problems;
