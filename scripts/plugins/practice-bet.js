/**
 * Practice bet is a plug-in that handles a practice trial of a student betting
 * problem.
 * 
 * Instead of iterating over the canvas and hypothesis space here, the canvas
 * and hypothesis space is already pre-filled in the practice-prolem div in 
 * the "index.html" file. 
 * 
 * There are no parameters or trial data written.
 */

jsPsych.plugins["practice-bet"] = (function() {

    var plugin = {};
  
    plugin.info = {
      name: "practice-bet",
      parameters: {}
    }
  
    plugin.trial = function(display_element, trial) {
        
        let bets = Array.from(uniform_betting_priors);

        /**
         * Helper function that returns the sum of all the current bets since
         * there is no built-in sum operator for lists in JavaScript.
         * 
         * @return {Integer} sum over all the bets currently placed on the
         *     bettting sliders
         */
        function get_bet_sums() {
            let sum = 0;
            for (let i = 0; i < bets.length; i++) {
                sum += bets[i]
            }
            return sum;
        };

        /**
         * When a slider's change event listener is triggered, this function 
         * handles the new betting by doing the following: 
         * 
         * (1) Calculates the new betting total.
         * (2) If the new betting total is equal to 100, change the tally box 
         *     to green, enable the "Place Bets" button, and, when pressed,
         *     finish trial.
         * (3) If the new betting total is not equal 100, change the tally box 
         *     to red and disable the "Place Bets" button.
         * 
         * @param {Integer} slider_indx the slider index that indentifies which 
         *     slider has changed 
         * @param {Integer} new_bet The new bet that the partcipant made
         */ 
        function handle_betting(slider_indx, new_bet) {

            bets[slider_indx] = new_bet;

            const betting_total = get_bet_sums();
            const button = $(display_element).find('button');

            $(display_element).find('.total-bets-tally').html("Total: " + 
              betting_total);
            
            if (jsPsych.pluginAPI.compareKeys(betting_total, 100)) {

                $(display_element).find('.total-bets-tally-container').css(
                    'background-color', '#6cbd6c');

                button.prop('disabled', false); 
                button.unbind('click'); 
                button.one('click', function(){ 
                    jsPsych.finishTrial();
                });
            } else { 
                $(display_element).find('.total-bets-tally-container').css(
                    'background-color', '#e04848');
                button.prop('disabled', true); 
                button.unbind('click'); 
            };
        };

        let content = $('#templates #practice-problem').html();
        const heading = 'How to play';
        const subheading = 'Let\'s practice!';
        const subsubheading = 'Based on these hints, how would you distribute your chips to place bets?';
        const total_text = 'Total: ' + get_bet_sums(bets);
        const button_text = 'Place Bets'

        content = sprintf(content, heading, subheading, subsubheading, 
            total_text, button_text);
        $(display_element).html(content);

        // Initialize all the betting sliders for each hypothesis (option) with 
        // the appropriate values. Here, they are all uniform betting priors.
        const hypothesis_order = ["A", "B", "C", "D"];
        for (let indx = 0; indx < hypothesis_order.length; indx++) {
            const slider_id = "#" + hypothesis_order[indx] + 
                    "-practice-betting-slider";
            new Slider(slider_id,{tooltip: 'always'}).on('change', 
                function(event) {
                    handle_betting(indx, event.newValue);
                }
            );
        };
    };
  
    return plugin;
  })();
  