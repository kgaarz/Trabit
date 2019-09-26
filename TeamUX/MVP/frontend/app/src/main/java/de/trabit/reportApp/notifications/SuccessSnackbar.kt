import android.view.View
import androidx.core.content.ContextCompat
import de.trabit.reportApp.R
import de.trabit.reportApp.notifications.TrabitSnackbar

class SuccessSnackbar (view : View) : TrabitSnackbar(view){
    override val colorBackground = ContextCompat.getColor(this.view.context, R.color.successGreen)
}