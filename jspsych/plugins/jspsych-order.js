/**
 * jspsych-order
 * Nikolas McNeal
 *
 * plugin for displaying a stimulus and getting a button response
 *
 * documentation: docs.jspsych.org
 *
 **/

 jsPsych.plugins["order"] = (function() {

  var plugin = {};

  jsPsych.pluginAPI.registerPreload('order', 'stimulus', 'image');

  plugin.info = {
    name: 'order',
    description: '',
    parameters: {
      stimulus_img: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'Stimulus',
        default: undefined,
        description: 'The image to be displayed'
      },
      stimulus_audio: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'Stimulus',
        default: undefined,
        description: 'The image to be displayed'
      },
      stimulus_height: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Image height',
        default: null,
        description: 'Set the image height in pixels'
      },
      stimulus_width: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Image width',
        default: null,
        description: 'Set the image width in pixels'
      },
      maintain_aspect_ratio: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Maintain aspect ratio',
        default: true,
        description: 'Maintain the aspect ratio after setting width or height'
      },
      choices: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Choices',
        default: undefined,
        array: true,
        description: 'The labels for the buttons.'
      },
      button_html: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button HTML',
        default: '<button class="jspsych-btn">%choice%</button>',
        array: true,
        description: 'The html of the button. Can create own style.'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed under the button.'
      },
      stimulus_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Stimulus duration',
        default: null,
        description: 'How long to hide the stimulus.'
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long to show the trial.'
      },
      margin_vertical: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Margin vertical',
        default: '0px',
        description: 'The vertical margin of the button.'
      },
      margin_horizontal: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Margin horizontal',
        default: '8px',
        description: 'The horizontal margin of the button.'
      },
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
        description: 'If true, then trial will end when user responds.'
      },
      render_on_canvas: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Render on canvas',
        default: true,
        description: 'If true, the image will be drawn onto a canvas element (prevents blank screen between consecutive images in some browsers).'+
          'If false, the image will be shown via an img element.'
      }
    }
  }


function startDrag(e) {

    if (!e) {
        var e = window.event;
    }
    if(e.preventDefault) e.preventDefault();


    targ = e.target ? e.target : e.srcElement;

    if (targ.className != 'dragme') {return};
        offsetX = e.clientX;
        offsetY = e.clientY;


    if(!targ.style.left) { targ.style.left='0px'};
    if (!targ.style.top) { targ.style.top='0px'};

    coordX = parseInt(targ.style.left);
    coordY = parseInt(targ.style.top);
    drag = true;

        document.onmousemove=dragDiv;
    return false;
    
  }
function dragDiv(e) {
    if (!drag) {return};
    if (!e) { var e= window.event};
    targ.style.left=coordX+e.clientX-offsetX+'px';
    targ.style.top=coordY+e.clientY-offsetY+'px';
    return false;
  }
function stopDrag() {
    drag=false;
}
window.onload = function() {
    document.onmousedown = startDrag;
    document.onmouseup = stopDrag;
}





  plugin.trial = function(display_element, trial) {

    var height, width;
    var html;







    // display stimulus as an image element
      html = '<img src="'+trial.stimulus_img+'" id="jspsych-order-stimulus" class="dragme" data-state="play" >';
      html += '<audio id="two" src="'+trial.stimulus_audio+'" preload> Your browser does not support the <code>audio</code> tag </audio>';
 

      



      // add prompt
      if (trial.prompt !== null){
        html += trial.prompt;
      }
      // update the page content
      display_element.innerHTML = html;

    

      document.getElementById('jspsych-order-stimulus').addEventListener("click", function(d) {
        var state = d.currentTarget.dataset.state;
        d.currentTarget.dataset.state = "play"
        if (state == "play") {
          document.getElementById("two").play();
          d.currentTarget.dataset.state = "pause";
        } else {
          document.getElementById("two").pause();
          document.getElementById("two").currentTime=0;
          // e.currentTarget.dataset.state = "play";
          // document.getElementById("two").play();
        }
      });












    // start timing
    var start_time = performance.now();

    // store response
    var response = {
      rt: null,
      button: null
    };

    // function to handle responses by the subject
    function after_response(choice) {

      // measure rt
      var end_time = performance.now();
      var rt = end_time - start_time;
      response.button = parseInt(choice);
      response.rt = rt;

      // after a valid response, the stimulus will have the CSS class 'responded'
      // which can be used to provide visual feedback that a response was recorded
      display_element.querySelector('#jspsych-order-stimulus').className += ' responded';



      if (trial.response_ends_trial) {
        end_trial();
      }
    };

    // function to end trial when it is time
    function end_trial() {

      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // gather the data to store for the trial
      var trial_data = {
        rt: response.rt,
        stimulus: trial.stimulus_img,
        response: response.button
      };

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
      jsPsych.finishTrial(trial_data);
    };


    // end trial if time limit is set
    if (trial.trial_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        end_trial();
      }, trial.trial_duration);
    } else if (trial.response_ends_trial === false) {
      console.warn("The experiment may be deadlocked. Try setting a trial duration or set response_ends_trial to true.");
    }
  };

  return plugin;
})();
