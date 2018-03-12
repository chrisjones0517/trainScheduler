$(document).ready(function () {

    // Initialize Firebase
    var firstTrainTime;
    var minutesAway;
    var futureMinutes = moment().minutes();
    var currentMinutes = new Date().getTime();
    minutesAway = 10;
    var database;
    var config = {
        apiKey: "AIzaSyAgteNT3MXqRIEIKaWiLC7U6gObyVnUCIs",
        authDomain: "train-scheduler-fbf02.firebaseapp.com",
        databaseURL: "https://train-scheduler-fbf02.firebaseio.com",
        projectId: "train-scheduler-fbf02",
        storageBucket: "",
        messagingSenderId: "822253192991"
    };
    firebase.initializeApp(config);
    database = firebase.database();
    var ref = database.ref('train data');
    ref.on('value', gotData, errData);

    setInterval(function () {
        ref.on('value', gotData, errData);
    }, 5000);

    // Load train data from database to page
    // setInterval(function() {
    //     console.log('Time ran');
    // }, 1000);
    $('#formSubmit').on('click', function (e) {

        e.preventDefault();
        var nameInput = $('#nameInput').val();
        var destinationInput = $('#destinationInput').val();
        var timeInput = $('#timeInput').val();
        var frequencyInput = $('#frequencyInput').val();
        var mutable = 'mutable';
        var data = {
            trainName: nameInput,
            destination: destinationInput,
            firstTrainTime: timeInput,
            frequency: frequencyInput,
            class: mutable
        }
        // console.log(data);
        if (nameInput === '') {
            alert('You must enter a valid train name!');
        } else if (destinationInput === '') {
            alert('You must enter a valid destination!');
        } else if (timeInput === '') {
            alert('You must enter a valid first train time!');
        } else if (frequencyInput === '') {
            alert('You must enter a valid train trip frequency!');
        } else {
            //  Form tags
            ref.push(data);
            $('#nameInput').val('');
            $('#destinationInput').val('');
            $('#timeInput').val('');
            $('#frequencyInput').val('');


        }


    });

    $(document).on('click','.remove', function() {
        console.log('I ran!!!');
    });


    function gotData(data) {
        // console.log(data.val());
        if (data.val() !== null) {
            var trains = data.val();
            var keys = Object.keys(trains);
            $('.added').remove();
            for (var i = 0; i < keys.length; i++) {
                var k = keys[i];
                var first = trains[k].firstTrainTime;
                var freq = trains[k].frequency;
                var crntTimeInMin = parseInt(moment().format('H HH')) * 60 + parseInt(moment().format('mm'));
                var firstInMin = moment(first, 'hh mm A').format('H') * 60 + parseInt(moment(first, 'hh:mm A').format('mm'));
                var nextTrainInMin = (Math.ceil((crntTimeInMin - firstInMin) / freq) * freq) + firstInMin;
                var minutesAway = nextTrainInMin - crntTimeInMin;
                if (firstInMin > crntTimeInMin) {
                    nextTrainInMin = firstInMin;
                    minutesAway = firstInMin - crntTimeInMin;
                }
                //       console.log(firstInMin);
                var nextTrainStr = Math.floor(nextTrainInMin / 60).toString() + (nextTrainInMin % 60).toString();
                var nextTrainArr = moment(nextTrainStr, 'hhmm').format('HH:mm A');
                var arr = nextTrainArr.split(':');
                if (parseInt(arr[0]) > 12) {
                    var convert = parseInt(arr[0]) - 12;
                    var str = convert.toString();
                    arr.splice(0, 1, str, ':');
                    var nextTrain = arr.join('');
                }

                //  console.log(nextTrain);



                $('tbody').append(`
            <tr class="added">
                <td>${trains[k].trainName}</td>
                <td>${trains[k].destination}</td>
                <td>${freq}</td>
                <td>${nextTrain}</td> 
                <td>${minutesAway}</td>
                <td><span class="remove">&#x274C</span><span class="change">+</span></td>
            </tr>
            `);

                if (trains[k].class === 'mutable') {
                    $('.added:last-child').addClass('mutable');
                }

            }
        }
    }

    function errData(err) {
        console.log('Error!');
        console.log(err);
    }


});