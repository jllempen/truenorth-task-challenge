import '../css/DialogBox.css'
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

function DialogBox(props) {
    console.log('propsDialog',props);

    return (
        <Dialog
            open={props.open}
            keepMounted
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle id="alert-dialog-slide-title" className="dialog-box-title">
                {props.config.title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description" className="dialog-box-message">
                    {props.config.message}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.close} color="primary" className="dialog-box-actions">
                    Close
                </Button>
                {
                    props.config.action ?  
                    <Button onClick={props.config.action} color="primary" className="dialog-box-actions">
                        {props.config.actionName}
                    </Button>
                    : ''
                }
            </DialogActions>
        </Dialog>
    )
}
export default DialogBox;