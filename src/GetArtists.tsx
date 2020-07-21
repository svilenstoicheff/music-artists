import React from 'react';

class GetArtists extends React.Component {

  async searchArtists(e: React.FormEvent) {
    e.preventDefault();
    const options = {
      method: 'GET',
      headers: { "X-Auth-Token": "64b32c8086f30f682d47312e370904bd" },
    };
    const searchInput = document.querySelector('#search-box') as HTMLInputElement;
    if(!searchInput.value.trim()) {
      searchInput.classList.add('error');
      return;
    }
    searchInput.classList.remove('error');

    const apiKey = '64b32c8086f30f682d47312e370904bd';
    const url = 'http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=' + searchInput.value + '&api_key=' + apiKey + '&format=json';

    await fetch(url, options)
      .then(response => response.json())
      .then(data => {
        const artist = data.results.artistmatches.artist;
        displayArtists(artist);
      });

    function displayArtists(artist: Array<any>) {
      console.log(artist);
      artist.map(artist => {
        if ('content' in document.createElement('template')) {
          let listTemplate = document.querySelector('#artistList li') as HTMLLIElement;
          let clone = listTemplate.cloneNode(true) as HTMLTemplateElement;
          //clone.setAttribute('data-name', artist.name);
          let bioLink = clone.querySelector('.bioLink') as HTMLButtonElement;
          let tracksLink = clone.querySelector('.tracksLink') as HTMLButtonElement;
          bioLink.textContent = artist.name;
          bioLink.setAttribute('data-name', artist.name)
          tracksLink.setAttribute('data-name', artist.name);

          bioLink.addEventListener('click', getArtistInfo);
          tracksLink.addEventListener('click', getArtistTopTracks);
          let container = document.querySelector('#artistListContainer') as HTMLUListElement;

          container.appendChild(clone);
        } else {
          console.log('Templates not supported');
          //<template> not supported, use a traditional solution - concatenated strings, Mustache, etc. 
        }
      });
    }


    async function getArtistInfo(event: Event) {
      let element = event.target as HTMLElement;
      let artistName = element.getAttribute('data-name');
      const url = `http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${artistName}&api_key=${apiKey}&format=json`;

      await fetch(url, options)
        .then(response => response.json())
        .then(data => {
          console.log(data);

          let summaryContainer = document.querySelector('#infoContainer .summary') as HTMLDivElement;
          let fullBioContainer = document.querySelector('#infoContainer .fullBio') as HTMLDivElement;
          summaryContainer.innerHTML = `<p>${data.artist.bio.summary}</p>`;
          fullBioContainer.innerHTML = `<p>${data.artist.bio.content}</p>`;
        
        });
    }

    async function getArtistTopTracks(event: Event) {
      let element = event.target as HTMLElement;
      let artistName = element.getAttribute('data-name');
      const url = `http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=${artistName}&api_key=${apiKey}&format=json`;
      let tracksCollection: string = '';

      await fetch(url, options)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          let tracksContainer = document.querySelector('#infoContainer .trackList ol') as HTMLOListElement;
          data.toptracks.track.forEach(function(track: { name: any; }, idx: number) {
            if(idx < 20) {
              let listItem = `<li>${track.name}</li>`;
              tracksCollection += listItem;
            }
            
          });
          tracksContainer.innerHTML = tracksCollection;
        });
    }
  }

  render() {
    return (<article className="contentContainer">
      <form onSubmit={this.searchArtists}>
        <input type="text" id="search-box" placeholder="type an artist's name" defaultValue=""></input>
        <input type="submit" value="Search"/>
      </form>
      <ul id="artistListContainer"></ul>
      <section id="infoContainer">
        <div className="summary">summary</div>
        <div className="fullBio">full bio</div>
        <div className="trackList">tracks
          <ol></ol>
        </div>
      </section>
      <template id="artistList">
        <li>
          <button className="bioLink" data-name="">See bio</button>
          <button className="tracksLink" data-name="">See top tracks</button>
        </li>
      </template>
    </article>);
  }
}

export default GetArtists;