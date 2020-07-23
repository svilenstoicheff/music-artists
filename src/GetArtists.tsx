import React from 'react';

class GetArtists extends React.Component {

  async searchArtists(e: React.FormEvent) {
    e.preventDefault();
    const options = {
      method: 'GET',
      headers: { "X-Auth-Token": "64b32c8086f30f682d47312e370904bd" },
    };
    const searchInput = document.querySelector('#search-box') as HTMLInputElement;
    if (!searchInput.value.trim()) {
      searchInput.classList.add('error');
      return;
    }
    searchInput.classList.remove('error');

    const trackListContainer = document.querySelector('#infoContainer .trackList') as HTMLDivElement;
    let tracksSlot = trackListContainer.querySelector('ol') as HTMLOListElement;
    const fullBioContainer = document.querySelector('#infoContainer .fullBio') as HTMLDivElement;
    const bioSlot = fullBioContainer.querySelector('p') as HTMLParagraphElement;
    const expandButton = fullBioContainer.querySelector('button') as HTMLButtonElement;

    const apiKey = '64b32c8086f30f682d47312e370904bd';
    const url = `http://ws.audioscrobbler.com/2.0/?method=artist.search&limit=20&artist=${searchInput.value}&api_key=${apiKey}&format=json`;

    await fetch(url, options)
      .then(response => response.json())
      .then(data => {
        const artist = data.results.artistmatches.artist;
        displayArtists(artist);
      });

    function displayArtists(artist: Array<any>) {
      const container = document.querySelector('#artistListContainer') as HTMLUListElement;
      if (artist.length !== 0) {
        container.innerHTML = '';

        artist.forEach(artist => {
          if ('content' in document.createElement('template')) {

            let listTemplate = document.querySelector('#artistList li') as HTMLLIElement;
            let clone = listTemplate.cloneNode(true) as HTMLTemplateElement;
            let bioLink = clone.querySelector('.bioLink') as HTMLButtonElement;
            let tracksLink = clone.querySelector('.tracksLink') as HTMLButtonElement;
            bioLink.textContent = artist.name;
            bioLink.setAttribute('data-name', artist.name)
            tracksLink.setAttribute('data-name', artist.name);
            bioLink.addEventListener('click', getArtistInfo);
            tracksLink.addEventListener('click', getArtistTopTracks);
            container.appendChild(clone);

          } else {
            console.log('Templates not supported');
            //<template> not supported, use a traditional solution - concatenated strings, Mustache, etc. 
          }
        });

      } else {
        container.innerHTML = 'No artists available for your search'
      }
    }

    async function getArtistInfo(event: Event) {
      const element = event.target as HTMLElement;
      const artistName = element.getAttribute('data-name');
      const url = `http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${artistName}&api_key=${apiKey}&limit=20&format=json`;

      const summaryContainer = document.querySelector('#infoContainer .summary') as HTMLDivElement;
      const summarySlot = summaryContainer.querySelector('p') as HTMLParagraphElement;
      const nameContainer = document.querySelector('h2.artistName') as HTMLHeadingElement;
      const allTrackLinks = document.querySelectorAll('.tracksLink') as NodeListOf<HTMLButtonElement>;
      const trackList = document.querySelector('.trackList') as HTMLDivElement;
      trackList.classList.add('hidden');
      allTrackLinks.forEach(link => link.classList.add('hidden'));
      document.querySelector('.highlight')?.classList.remove('highlight');
      element.classList.add('highlight');
      element.parentElement?.querySelector('.tracksLink')?.classList.remove('hidden');

      await fetch(url, options)
        .then(response => response.json())
        .then(data => {
          summaryContainer.classList.remove('hidden');
          fullBioContainer.classList.remove('hidden');
          nameContainer.innerText = data.artist?.name;

          let artistSummary = data.artist?.bio?.summary;
          let artistBio = data.artist?.bio?.content;

          summarySlot.innerHTML = artistSummary ? artistSummary : '<p class="error">No summary available</p>';
          bioSlot.innerHTML = artistBio ? artistBio : '<p class="error">No bio available</p>';
          artistBio ? fullBioContainer.classList.remove('hidden') : fullBioContainer.classList.add('hidden');
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
          trackListContainer.classList.remove('hidden');
          bioSlot.classList.add('hidden');
          expandButton.innerText = 'Click to expand';
          if (data.toptracks) {
            data.toptracks?.track.forEach(function (track: { name: any; url: any; }, idx: number) {
              if (idx < 20) {
                let listItem = `<li>${track.name} <a href="${track.url}" target="_blank" class="play"> >> </a></li>`;
                tracksCollection += listItem;
              }
            });
            tracksSlot.classList.remove('error');
            tracksSlot.innerHTML = tracksCollection;

          } else {
            tracksSlot.innerHTML = '<li class="error">No tracks found</li>';
          }
        })
        .catch((error) => {
          tracksSlot.innerHTML = '<li class="error">No tracks found</li>';
          console.log(error);
        });
    }

    expandButton.removeEventListener('click', handleButtonClick, true);

    function handleButtonClick(e: Event) {
      let target = e.target as HTMLButtonElement;
      if (bioSlot.classList.contains('hidden')) {
        bioSlot.classList.remove('hidden');
        target.innerText = 'Click to collapse';
      } else {
        bioSlot.classList.add('hidden');
        target.innerText = 'Click to expand';
      }
    }

    expandButton.addEventListener('click', handleButtonClick, true);
  }

  render() {
    return (<article className="contentContainer">
      <form onSubmit={this.searchArtists}>
        <input type="text" id="search-box" placeholder="type an artist's name" defaultValue=""></input>
        <input type="submit" value="Search" />
      </form>
      <ul id="artistListContainer"></ul>

      <section id="infoContainer">
        <h2 className="artistName"> </h2>
        <div className="summary hidden">
          <h3>Summary</h3>
          <p></p>
        </div>
        <div className="fullBio hidden">
          <h3>Full bio <button>click to expand</button></h3>

          <p className="hidden"></p>
        </div>

        <div className="trackList hidden">
          <h3>Top tracks</h3>
          <ol></ol>
        </div>
      </section>
      <template id="artistList">
        <li>
          <button className="bioLink" data-name="">See bio</button>
          <button className="tracksLink hidden" data-name="">See top tracks</button>
        </li>
      </template>
    </article>);
  }
}

export default GetArtists;