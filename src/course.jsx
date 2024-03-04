const Course = ({ course }) => {
    const totalEjercicios = course.parts.reduce((sum, part) => sum + part.exercises, 0); // Cambiar totalExercises a totalEjercicios
    
    return (
      <div>
        <h2>{course.name}</h2>
        <ul>
          {course.parts.map((part) => (
            <li key={part.id}> {/* Cambiar clave a key */}
              {part.name} - {part.exercises} ejercicios
            </li>
          ))}
        </ul>
        <p>Total de ejercicios: {totalEjercicios}</p> {/* Cambiar totalExercises a totalEjercicios */}
      </div>
    );
  };
  
  export default Course; 