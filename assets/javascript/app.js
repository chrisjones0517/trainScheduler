$(document).ready(function () {

    var config = {
        apiKey: "AIzaSyAgteNT3MXqRIEIKaWiLC7U6gObyVnUCIs",
        authDomain: "train-scheduler-fbf02.firebaseapp.com",
        databaseURL: "https://train-scheduler-fbf02.firebaseio.com",
        projectId: "train-scheduler-fbf02",
        storageBucket: "",
        messagingSenderId: "822253192991"
    };
    firebase.initializeApp(config);
    var database = firebase.database();
    var ref = database.ref();
    ref.on('value', gotData, errData);

    setInterval(function () {
        ref.on('value', gotData, errData);
    }, 5000);

    $('#formSubmit').on('click', function (e) {

        e.preventDefault();
        var nameInput = $('#nameInput').val();
        var destinationInput = $('#destinationInput').val();
        var timeInput = $('#timeInput').val();
        var frequencyInput = $('#frequencyInput').val();
        var data = {
            trainName: nameInput,
            destination: destinationInput,
            firstTrainTime: timeInput,
            frequency: frequencyInput
        }

        if (nameInput === '') {
            alert('You must enter a valid train name!');
        } else if (destinationInput === '') {
            alert('You must enter a valid destination!');
        } else if (timeInput === '') {
            alert('You must enter a valid first train time!');
        } else if (frequencyInput === '' || parseInt(frequencyInput) > 1440 || parseInt(frequencyInput) <= 0) {
            alert('You must enter a train trip frequency between 1 and 1439!');
        } else {
            ref.push(data);

            $('#nameInput').val('');
            $('#destinationInput').val('');
            $('#timeInput').val('');
            $('#frequencyInput').val('');
        }
    });

    function gotData(data) {

        if (data.val() !== null) {
            var trains = data.val();
            var keys = Object.keys(trains);
            $('.added').remove();
            for (var i = 0; i < keys.length; i++) {
                var k = keys[i];
                var first = trains[k].firstTrainTime;
                var freq = trains[k].frequency;

                // Time conversions begin

                var firstTimeConverted = moment(first, 'hh:mm A').subtract(1, 'years');
                var currentTime = moment();
                var diffTime = moment().diff(moment(firstTimeConverted), 'minutes');
                var tRemainder = diffTime % freq;
                var minutesAway = freq - tRemainder;
                var nextTrain = moment().add(minutesAway, 'minutes');
                var nextTrainConverted = moment(nextTrain).format('hh:mm A');
                
                $('tbody').append(`
            <tr class="added">
                <td>${trains[k].trainName}</td>
                <td>${trains[k].destination}</td>
                <td>${freq}</td>
                <td>${nextTrainConverted}</td> 
                <td>${minutesAway}</td>
            </tr>
            `);
            }
        }
    }

    function errData(err) {
        console.log('Error!');
        console.log(err);
    }
});
