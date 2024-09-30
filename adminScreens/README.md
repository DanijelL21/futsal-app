# TODO

Data flow in LiveMatch screen:

Goal scored button is pressed -> in IconButtonList is event created ->
-> Modal is opened. Event is written to firebase-> After the modal is closed, event fetch triger is set to true
-> Data is pulled from firebase and event list is created
