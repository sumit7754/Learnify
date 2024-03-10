import { useNavigate } from 'react-router-dom';

function CourseCard({ data }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate('/courses/description/', { state: { ...data } })}
      className="bg-gray-800 ml-9 text-white shadow-lg rounded-lg cursor-pointer overflow-hidden hover:shadow-xl transition duration-300 w-72 h-96"
    >
      <img
        className="w-full h-48 object-cover object-center"
        src={data?.thumbnail?.secure_url}
        alt="Course Thumbnail"
      />
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">{data?.title}</h2>
        <p className="text-sm mb-4 line-clamp-3">{data?.description}</p>
        <div className="flex items-center justify-between text-sm">
          <p>
            <span className="font-bold">Category:</span> {data?.category}
          </p>
          <p>
            <span className="font-bold">Total Lectures:</span> {data?.numberoflectures}
          </p>
        </div>
        <div className="flex items-center mt-2">
          <span className="font-bold mr-2">Instructor:</span>
          <p>{data?.createdBy}</p>
        </div>
      </div>
    </div>
  );
}

export default CourseCard;
