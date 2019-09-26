import android.view.View
import androidx.core.content.ContextCompat
import com.google.android.material.snackbar.Snackbar
import de.trabit.reportApp.R
import de.trabit.reportApp.notifications.TrabitSnackbar

class ErrorSnackbar (view : View) : TrabitSnackbar(view){
    override val colorBackground = ContextCompat.getColor(this.view.context, R.color.errorRed)
    override val length = Snackbar.LENGTH_INDEFINITE
}