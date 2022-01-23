exports.utils = 
{
    validChars: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '-', '\'', ' '],

    randomize: function (array)
    {
        let rand = Math.floor(Math.random()*array.length);
        console.log(rand);
        return rand;
    },

    getEmoji: function (id, client)
    {
        let emoji = client.emojis.cache.get(id);
        return emoji;
    },

    getCurrentDate: function ()
    {
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0');
        let year = today.getFullYear();

        today = year + '-' + mm + '-' + dd;

        return today;
    },

    nameValidation: function (string) //return both isValid and err that lets player know what they did wrong.
    {
        let isValid = true;

        let array = string.split('');

        for (let i = 0; i < array.length; i++)
        {
            let validity = this.validChars.includes(array[i]);

            if (!validity)
            {
                isValid = false;
            }
        }

        let moreThanOneSpace = string.search('  ');

        if (moreThanOneSpace != -1)
        {
            isValid = false;
        }

        if (string[0] == ' ')
        {
            isValid = false;
        }
        if (string[string.length - 1] == ' ')
        {
            isValid = false;
        }
        if (string == '')
        {
            isValid = false;
        }
        if (string.length > 20)
        {
            isValid = false;
        }
        if (string == 'child1' || string == 'child2' || string == 'child3' || string == 'child4')
        {
            isValid = false;
        }

        return isValid;
    },

    getTimeDifference: function (endtime)
    {
        const total = Date.parse(endtime) - Date.parse(new Date());
        const seconds = Math.floor( (total/1000) % 60 );
        const minutes = Math.floor( (total/1000/60) % 60 );
        const hours = Math.floor( (total/(1000*60*60)) % 24 );
        const days = Math.floor( total/(1000*60*60*24) );
      
        return {
          total,
          days,
          hours,
          minutes,
          seconds
        };
    }
}