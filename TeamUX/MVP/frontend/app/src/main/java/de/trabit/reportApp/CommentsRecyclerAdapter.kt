package de.trabit.reportApp

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.api_test.dataClasses.Comment
import java.text.SimpleDateFormat
import java.util.*
import kotlin.collections.ArrayList


//Adapter Class to adapt the CommentsRecyclerview with the Layout
class CommentsRecyclerAdapter(private val commentsList: ArrayList<Comment>) : RecyclerView.Adapter<CommentsRecyclerAdapter.ViewHolder>() {

    override fun onCreateViewHolder(p0: ViewGroup, p1: Int): ViewHolder {
        val v = LayoutInflater.from(p0.context).inflate(R.layout.comments_item, p0, false)
        return ViewHolder(v)
    }

    override fun onBindViewHolder(p0: ViewHolder, position: Int) {
        val comment = commentsList[position]

        // format date for comment view
        val dateFormatter = SimpleDateFormat("dd.MM.yyyy", Locale.GERMAN)
        val today = Calendar.getInstance()
        val yesterday = Calendar.getInstance()
        yesterday.add(Calendar.DAY_OF_YEAR, -1)
        val commentDate = when (dateFormatter.format(comment.created))
        {
            dateFormatter.format(today.time) -> "Heute"
            dateFormatter.format(today.time) -> "Gestern"
            else -> dateFormatter.format(comment.created)
        }

        // format time for comment view
        val timeFormatter = SimpleDateFormat("HH:mm", Locale.GERMAN)
        val commentTime = timeFormatter.format(comment.created)

        // calculate votes
        val votes = comment.metadata.upvotes.amount - comment.metadata.downvotes.amount

        p0.commentDayText.text = commentDate
        p0.commentTimeText.text = commentTime
        p0.commentUsernameText.text = comment.author
        p0.commentText.text = comment.content
        p0.commentConfirmIndex.text = votes.toString()
    }

    override fun getItemCount(): Int {
        return commentsList.size
    }

    class ViewHolder (itemView: View) : RecyclerView.ViewHolder(itemView) {
        val commentDayText = itemView.findViewById(R.id.dayText) as TextView
        val commentTimeText = itemView.findViewById(R.id.timeText) as TextView
        val commentUsernameText = itemView.findViewById(R.id.usernameText) as TextView
        val commentConfirmIndex = itemView.findViewById(R.id.vote_number) as TextView
        val commentText = itemView.findViewById(R.id.commentText) as TextView
    }
}