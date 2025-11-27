import { useState } from 'react';
import { Star } from 'lucide-react';
import { useTheme } from '../ThemeProvider';

const CourseRating = ({ courseId, currentRating = 0, onRatingSubmit }) => {
  const { getThemeStyles } = useTheme();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating > 0) {
      await onRatingSubmit(courseId, rating, comment);
      setShowForm(false);
      setRating(0);
      setComment('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-5 h-5 cursor-pointer ${
                star <= currentRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className="text-sm" style={getThemeStyles({ color: '#64748b' }, { color: '#94a3b8' })}>
          {currentRating.toFixed(1)} out of 5
        </span>
      </div>

      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
        >
          Write a Review
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Your Rating</label>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-6 h-6 cursor-pointer ${
                    star <= (hover || rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                />
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Comment (Optional)</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows="3"
              placeholder="Share your thoughts about this course..."
              style={getThemeStyles(
                { backgroundColor: '#ffffff', borderColor: '#e2e8f0' },
                { backgroundColor: '#1e293b', borderColor: '#374151' }
              )}
            />
          </div>
          
          <div className="flex space-x-2">
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Submit Review
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              style={getThemeStyles(
                { borderColor: '#e2e8f0' },
                { borderColor: '#374151' }
              )}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CourseRating;