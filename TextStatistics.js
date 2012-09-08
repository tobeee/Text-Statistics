    /*

        TextStatistics Class in Javascript
        see original: https://github.com/FCC/Text-Statistics/blob/master/TextStatistics.php

        Released under New BSD license
        http://www.opensource.org/licenses/bsd-license.php

        Calculates following readability scores (formulae can be found in wiki):
          * Flesch Kincaid Reading Ease
          * Flesch Kincaid Grade Level
          * Gunning Fog Score
          * Coleman Liau Index
          * SMOG Index
          * Automated Reability Index

        Will also give:
          * String length
          * Letter count
          * Syllable count
          * Sentence count
          * Average words per sentence
          * Average syllables per word
        
        Sample Code
        ----------------
        console.log(TextStatistics.syllable_count('lion'));
        console.log(TextStatistics.all('<p>this is a test delicious</p><br />I hope THIS works!'));
    */

var TextStatistics = {
  /**
   * Returns all text statictics
   * @param   strText         Text to be checked
   */
  all: function( strText )
  {
    return {
	  text: { original: strText,
	          cleaned: this.clean_text(strText),
			  statistics: {
			    letter_count: this.letter_count(strText),
				//Syllable Count
				word_count: this.word_count(strText),
				sentence_count: this.sentence_count(strText),
				//Characters per Word
				average_syllables_per_word: this.average_syllables_per_word(strText),
				average_words_per_sentence: this.average_words_per_sentence(strText),
			  }
			},
	  flesch_kincaid_reading_ease: this.flesch_kincaid_reading_ease(strText),
	  flesch_kincaid_grade_level: this.flesch_kincaid_grade_level(strText),
	  gunning_fog_score: this.gunning_fog_score(strText),
	  coleman_liau_index: this.coleman_liau_index(strText),
	  smog_index: this.smog_index(strText),
	  automated_readability_index: this.automated_readability_index(strText),
	  average_grade_level: this.average_grade_level(strText),
	}
  },

  /**
   * Gives the Flesch-Kincaid Reading Ease of text entered rounded to one digit
   * @param   strText         Text to be checked
   */
  flesch_kincaid_reading_ease: function( strText )
  {
    strText = this.clean_text(strText);
    return (206.835 - (1.015 * this.average_words_per_sentence(strText)) - (84.6 * this.average_syllables_per_word(strText)));
  },

  /**
   * Gives the Flesch-Kincaid Grade level of text entered rounded to one digit
   * @param   strText         Text to be checked
   */
  flesch_kincaid_grade_level: function( strText )
  {
    strText = this.clean_text(strText);
    return ((0.39 * this.average_words_per_sentence(strText)) + (11.8 * this.average_syllables_per_word(strText)) - 15.59);
  },

  /**
   * Gives the Gunning-Fog score of text entered rounded to one digit
   * @param   strText         Text to be checked
   */
  gunning_fog_score: function( strText )
  {
    strText = this.clean_text(strText);
    return ((this.average_words_per_sentence(strText) + this.percentage_words_with_three_syllables(strText, false)) * 0.4);
  },

  /**
   * Gives the Coleman-Liau Index of text entered rounded to one digit
   * @param   strText         Text to be checked
   */
  coleman_liau_index: function( strText )
  {
    strText = this.clean_text(strText);
    return ( (5.89 * (this.letter_count(strText) / this.word_count(strText))) - (0.3 * (this.sentence_count(strText) / this.word_count(strText))) - 15.8 );
  },

  /**
   * Gives the SMOG Index of text entered rounded to one digit
   * @param   strText         Text to be checked
   */
  smog_index: function( strText )
  {
    strText = this.clean_text(strText);
    return 1.043 * Math.sqrt((this.words_with_three_syllables(strText) * (30 / this.sentence_count(strText))) + 3.1291);
  },

  /**
   * Gives the Automated Readability Index of text entered rounded to one digit
   * @param   strText         Text to be checked
   */
  automated_readability_index: function( strText )
  {
    strText = this.clean_text(strText);
    return ((4.71 * (this.letter_count(strText) / this.word_count(strText))) + (0.5 * (this.word_count(strText) / this.sentence_count(strText))) - 21.43);
  },

  /**
   * Returns the average of all test.
   * @param   strText      Text to be measured
   */
  average_grade_level: function( strText )
  {
    return (this.flesch_kincaid_grade_level(strText) + this.gunning_fog_score(strText) + this.coleman_liau_index(strText) + this.smog_index(strText) + this.automated_readability_index(strText))/5;
  },
  
  /**
   * Gives string length.
   * @param   strText      Text to be measured
   */
  text_length: function( strText )
  {
    return strText.length;
  },

  /**
   * Gives letter count (ignores all non-letters). Tries mb_strlen and if that fails uses regular strlen.
   * @param   strText      Text to be measured
   */
  letter_count: function( strText )
  {
    strText = this.clean_text(strText); // To clear out newlines etc
    strText = strText.replace(/[^A-Za-z]+/g, '');
    return strText.length;
  },

  /**
   * Trims, removes line breaks, multiple spaces and generally
   * cleans text before processing.
   * @param   strText      Text to be transformed
   */
  clean_text: function( strText )
  {
    // all these tags should be preceeded by a full stop. 
    arrFullStopTags = ['li', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'dd'];
	objTags = /(<([^>]+)>)/ig;
	for( intFullStopTags in arrFullStopTags)
	{
	  strText = strText.replace('</'+arrFullStopTags[intFullStopTags]+'>', '.')
	}
    strText = strText.replace(objTags, ""); // Strip tags
	strText = strText.replace(/[,:;()-]/g, ' '); // Replace commans, hyphens etc (count them as spaces)
    strText = strText.replace(/[\.!?]/g, '.'); // Unify terminators
    strText = strText.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g,'').replace(/\s+/g,' ') + '.'; // Trim string, and add final terminator, just in case it's missing.
    strText = strText.replace(/[ ]*(\n|\r\n|\r)[ ]*/g, ' '); // Replace new lines with spaces
    strText = strText.replace(/([\.])[\. ]+/g, '.'); // Check for duplicated terminators
    strText = strText.replace(/[ ]*([\.])/g, '. ').replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g,'').replace(/\s+/g,' ') // Pad sentence terminators
    strText = strText.replace(/[ ]+/g, ' '); // Remove multiple spaces
    strText = strText.toLowerCase();// Lower case all words following terminators (for gunning fog score)
    return strText;
  },

  /**
   * Returns sentence count for text.
   * @param   strText      Text to be measured
   */
  sentence_count: function( strText )
  {
    strText = this.clean_text(strText);
    // Will be tripped up by "Mr." or "U.K.". Not a major concern at this point.
    intSentences = strText.match(/[\.!?]/g);
    return intSentences.length;
  },

  /**
   * Returns word count for text.
   * @param   strText      Text to be measured
   */
  word_count: function( strText )
  {
    strText = this.clean_text(strText);
    // Will be tripped by by em dashes with spaces either side, among other similar characters
    intWords = 1 + this.text_length(strText.replace(/[^ ]/g, '')); // Space count + 1 is word count
   return intWords;
  },

  /**
   * Returns average words per sentence for text.
   * @param   strText      Text to be measured
   */
  average_words_per_sentence: function( strText )
  {
    strText = this.clean_text(strText);
    intSentenceCount = this.sentence_count(strText);
    intWordCount = this.word_count(strText);
    return (intWordCount / intSentenceCount);
  },

  /**
   * Returns average syllables per word for text.
   * @param   strText      Text to be measured
   */
  average_syllables_per_word: function( strText )
  {
    strText = this.clean_text(strText);
    intSyllableCount = 0;
    intWordCount = this.word_count(strText);
    arrWords = strText.split(' ');
    for ( intWords in arrWords )
	{
      intSyllableCount += this.syllable_count(arrWords[intWords]);
    }
    return (intSyllableCount / intWordCount);
  },

  /**
   * Returns the number of words with more than three syllables
   * @param   strText                  Text to be measured
   * @param   blnCountProperNouns      Boolean - should proper nouns be included in words count
   */
  words_with_three_syllables: function( strText, blnCountProperNouns)
  {
    blnCountProperNouns = true;
    strText = this.clean_text(strText);
    intLongWordCount = 0;
    intWordCount = this.word_count(strText);
    arrWords = strText.split(' ');
    for ( intWords in arrWords )
	{
      if ( this.syllable_count(arrWords[intWords]) > 2)
	  {
        if (blnCountProperNouns)
		{ 
          intLongWordCount++;
        } else {
          strFirstLetter = arrWords[intWords].substring(0, 1);
          if (strFirstLetter !== strFirstLetter.toUpperCase())
		  {
            // First letter is lower case. Count it.
            intLongWordCount++;
          }
        }
      }
    }
    return (intLongWordCount);
  },

  /**
   * Returns the percentage of words with more than three syllables
   * @param   strText      Text to be measured
   * @param   blnCountProperNouns      Boolean - should proper nouns be included in words count
   */
  percentage_words_with_three_syllables: function(strText, blnCountProperNouns )
  {
    blnCountProperNouns = true;
    strText = this.clean_text(strText);
    intWordCount = this.word_count(strText);
    intLongWordCount = this.words_with_three_syllables(strText, blnCountProperNouns);
    intPercentage = ((intLongWordCount / intWordCount) * 100);
    return (intPercentage);
  },

  /**
   * Returns the number of syllables in the word.
   * Based in part on Greg Fast's Perl module Lingua::EN::Syllables
   * @param   strWord      Word to be measured
   */
  syllable_count: function( strWord ) 
  {
    intSyllableCount = 0;
	intPrefixSuffixCount = 0;
	strWord = strWord.toLowerCase();
    // Specific common exceptions that don't follow the rule set
	// below are handled individually
    // Array of problem words (with word as key, syllable count
	// as value)
    arrProblemWords = { 'simile': 3,
                        'forever': 3,
                        'shoreline': 2
                      };
    if( arrProblemWords[strWord] )
	{
	  return arrProblemWords[strWord];
	}
    // These syllables would be counted as two but should be one
    arrSubSyllables = [ /cial/g,
	                    /tia/g,
                        /cius/g,
                        /cious/g,
                        /giu/g,
                        /ion/g,
                        /iou/g,
                        /sia$/g,
                        /[^aeiuoyt]{2,}ed$/g,
                        /.ely$/g,
                        /[cg]h?e[rsd]?$/g,
                        /rved?$/g,
                        /[aeiouy][dt]es?$/g,
                        /[aeiouy][^aeiouydt]e[rsd]?$/g,
                        /^[dr]e[aeiou][^aeiou]+$/g, // Sorts out deal, deign etc
                        /[aeiouy]rse$/g, // Purse, hearse
                       ];
    // These syllables would be counted as one but should be two
    arrAddSyllables = [ /ia/g,
                        /riet/g,
                        /dien/g,
                        /iu/g,
                        /io/g,
                        /ii/g,
                        /[aeiouym]bl$/g,
                        /[aeiou]{3}/g,
                        /^mc/g,
                        /ism$/g,
                        /([^aeiouy])\1l$/g,
                        /[^l]lien/g,
                        /^coa[dglx]./g,
                        /[^gq]ua[^auieo]/g,
                        /dnt$/g,
                        /uity$/g,
                        /ie(r|st)$/g,
                      ];
    // Single syllable prefixes and suffixes
    arrPrefixSuffix = [ /^un/,
                        /^fore/g,
                        /ly$/g,
                        /less$/g,
                        /ful$/g,
                        /ers?$/g,
                        /ings?$/g,
                      ];
    // Remove prefixes and suffixes and count how many were taken
	for ( intPrefixSuffix in arrPrefixSuffix )
	{
	  if( arrPrefixSuffix[intPrefixSuffix].test(strWord) )
	  {
	    strWord = strWord.replace(arrPrefixSuffix[intPrefixSuffix], '');
	    intPrefixSuffixCount++;
	  }
	}
    // Removed non-word characters from word
    strWord = strWord.replace(/[^a-z]/g, '');
    arrWordParts = strWord.split(/[^aeiouy]+/g);
    intWordPartCount = 0;
    for( intWordParts in arrWordParts) {
      if (arrWordParts[intWordParts]) {
        intWordPartCount++;
      }
    }
    // Some syllables do not follow normal rules - check for them
    // Thanks to Joe Kovar for correcting a bug in the following lines
    intSyllableCount = intWordPartCount + intPrefixSuffixCount;
    for( intSubSyllables in arrSubSyllables )
	{
      if( arrSubSyllables[intSubSyllables].test(strWord) )
	  {
	    intSyllableCount--;
	  }
    }
    for( intAddSyllables in arrAddSyllables )
	{
      if( arrAddSyllables[intAddSyllables].test(strWord) )
	    {
		  intSyllableCount++;
		}
    }
	if( intSyllableCount == 0 )
	{
	  intSyllableCount = 1;
	}
    return intSyllableCount;
  },
  
}
