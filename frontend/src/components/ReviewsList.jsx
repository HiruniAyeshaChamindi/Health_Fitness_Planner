import { Star, User } from "lucide-react"

const ReviewsList = ({ reviews }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star key={index} className={`h-4 w-4 ${index < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
    ))
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
        <p className="text-gray-600">Be the first to leave a review for this coach</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900">Reviews ({reviews.length})</h3>

      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review._id} className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{review.userId.name}</h4>
                  <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
                </div>
              </div>

              <div className="flex items-center">
                {renderStars(review.rating)}
                <span className="ml-2 text-sm font-medium text-gray-900">{review.rating}/5</span>
              </div>
            </div>

            {review.reviewText && <p className="text-gray-700 leading-relaxed mb-4">{review.reviewText}</p>}

            {review.categories && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(review.categories).map(([category, rating]) => (
                  <div key={category} className="text-center">
                    <p className="text-xs text-gray-500 capitalize mb-1">{category.replace("_", " ")}</p>
                    <div className="flex justify-center">{renderStars(rating)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ReviewsList
