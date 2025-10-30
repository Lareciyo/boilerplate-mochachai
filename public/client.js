function Utils() {
  this.ready = function (fn) {
    if (typeof fn !== 'function') return;
    if (document.readyState === 'complete') return fn();
    document.addEventListener('DOMContentLoaded', fn, false);
  };

  this.ajax = function (options, cb) {
    const xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState === 4) {
        if (Math.floor(xmlhttp.status / 100) === 2) {
          var results = xmlhttp.responseText;
          var type = xmlhttp.getResponseHeader('Content-Type');
          if (type && type.match('application/json')) { // Added null/undefined check for 'type'
            try {
              results = JSON.parse(results);
            } catch (e) {
              console.error('Error parsing JSON:', e);
            }
          }
          cb(null, results);
        } else {
          cb(xmlhttp);
        }
      }
    };

    const method = options.method || 'get';
    let url = options.url || '/';

    if (url.charAt(url.length - 1) === '/') url = url.slice(0, url.length - 1);

    if (options.data) {
      let query;
      let contentType = "application/x-www-form-urlencoded";
      if (options.type && options.type === 'json') {
        query = JSON.stringify(options.data);
        contentType = "application/json";
      } else {
        query = [];
        for (let key in options.data) {
          query.push(key + '=' + encodeURIComponent(options.data[key]));
        }
        query = query.join('&'); // Fix: join with '&', not push '&' then pop
      }

      switch (method.toLowerCase()) {
        case 'get':
          url += ('?' + query);
          xmlhttp.open(method, url, true);
          xmlhttp.send();
          break;
        case 'put':
        case 'patch':
        case 'delete':
        case 'post':
          xmlhttp.open(method, url, true);
          xmlhttp.setRequestHeader("Content-type", contentType);
          xmlhttp.send(query);
          break;
        default:
          return;
      }
    } else {
      xmlhttp.open(method, url, true);
      xmlhttp.send();
    }
  };
}

const utils = new Utils();

utils.ready(function () {
  const form = document.getElementById('f1');
  const input = document.getElementById('i1');
  const div = document.getElementById('tn');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (input.value) {
      const options = {
        method: 'put', // Correct for client side interaction
        url: '/travellers',
        type: 'json',
        data: { surname: input.value }
      };
      div.innerHTML = '<p>Loading...</p>';
      utils.ajax(options, function (err, res) {
        if (err) return console.log(err);
        
        // Ensure res has name/surname before displaying, or use default
        const name = res.name || 'N/A';
        const surname = res.surname || input.value;
        const dates = res.dates || 'Unknown';

        div.innerHTML = '<p>first name: <span id="name">' + name + '</span></p>' +
                        '<p>last name: <span id="surname">' + surname + '</span></p>' +
                        '<p>dates: <span id="dates">' + dates + '</span></p>';
      });
    }
  });
});