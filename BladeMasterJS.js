/**
 * 
 * @title BladeMaster.js
 * @description Welcome BladeMaster! BladeMasterJS is a JS class that enhances the CryptoBlades.io UX experience while also offering an edge to battle
 * 
 * @ver 1.0
 * @author: phoenixtools
 * @contributors: Hudson Atwell
 */
 
 var BladeMasters = {
    
    scriptsLoaded : false,
	balances : {},
	marketPrices : {},
	traitMap : {},
	character : {},
	weapon : {},
	enemies: {},

	/**
	 *
	 */
	checkBattleStats: function() {
		
	
		this.loadHeader();
		this.loadListeners();
		this.loadPrices();
		this.loadWeb3();

		if(this.checkIfBattlePage()) {
			this.loadCharacter();
			this.loadWeapon();
			this.loadEnemies();
			this.calculateBattle();
		}
		
	
		
	}, 
	
	loadWeb3 : function() {
		
		if (this.scriptsLoaded) {
			return;
		}
		
		var jq = document.createElement('script');
	    jq.type = 'text/javascript';
	    jq.async = true;
	    jq.src = 'https://cdnjs.cloudflare.com/ajax/libs/web3/1.5.0/web3.min.js';
	    var s = document.body.getElementsByTagName('script')[0];
	    s.parentNode.insertBefore(jq, s);
	    
	    this.scriptsLoaded = true;
	}
	
	,

	loadHeader : function() {
		
		if (document.querySelector('.BladeMasterJS')) {
			return;
		}
		
		var headerElement= document.createElement('div');
		
		headerElement.innerHTML = '<div class="BladeMasterJS" style="background-color: darkslategray;color: #fff;text-align: end;padding-right:7px;">BladeMasterJS <span class="header-separator"> | </span> <b>BNB</b> <span class="bnb-price"></span><span class="header-separator"> | </span>  <b>SKILL</b> <span class="skill-price"></span>  <span class="skill-balance" style="color:lightgreen"></span>  <span class="header-separator"> | </span> <a class="bnb-tip"  href="#tip-blademaster-dev"  title="Send a Tip to the BladeMasterJS Developemnt Team!">TIP <span class="recommended-bnb-tip">.01</span> <b>BNB</b>  </a> <span class="header-separator"></div><style>.header-separator {margin:7px;}</style>'
		
		var firstChild = document.body.firstChild;
		firstChild.parentNode.insertBefore(headerElement, firstChild);
		
	}
	
	,
	
	
	loadListeners : function() {
		
		/* make sure element exitst before adding listener */
		if (document.querySelector('.bnb-tip')) {
			
			/* listen for TIP BNB event */
			document.querySelector('.bnb-tip').addEventListener('click', function() {
			
				  var transactionHash = window.ethereum.request({
				    method: 'eth_sendTransaction',
				    params: [
				      {
				        to: '0x2D6371DB3C7f3B1D44A7613e5Dc9dd49C740eC2A',
				        from: window.ethereum.selectedAddress,
				        value: Web3.utils.toHex(Web3.utils.toWei("0.01")),
				      },
				    ],
				  });
			} , {once :true} )
			
		}
		
		/* make sure element exitst before adding listener */
		if (document.querySelector('.skill-tip')) {
			
			/* listen for TIP SKILL event */
			document.querySelector('.skill-tip').addEventListener('click', function() {
			
			} , {once :true})
			
		}
		
		
	
		
		/* make sure element exitst before adding listener */
		if (document.querySelector('.weapon-icon')) {
			/* make sure that manual weapon mouseovers always renews the battlestats */
			document.querySelector('.weapon-icon').addEventListener('mouseenter', function() {
					BladeMasterJS.loadCharacter();
					BladeMasterJS.loadWeapon();
					BladeMasterJS.loadEnemies();
					BladeMasterJS.calculateBattle();
			} , {once :true} )
		}
		
		
		
	}
	
	,
	
	loadPrices : function() {
		
		if (this.marketPrices.bnb) {
			return;
		}
		
		/* get user balance, does not include staked BNB */
		this.balances.skill = document.querySelector('.balance').innerText.replace(' SKILL' , "").trim();
		
		
		var element = document.querySelector('.calculator-icon-div button');
		var event = new MouseEvent('click', {
		  'view': window,
		  'bubbles': true,
		  'cancelable': true
		});
		
		element.dispatchEvent(event);
		setTimeout(function() {
			
			/* get market prices */
			BladeMasters.marketPrices.bnb = document.querySelectorAll(".price-input")[0].value;
			BladeMasters.marketPrices.skill =  document.querySelectorAll(".price-input")[1].value;
			
			/* figure out $bnb and $skill */
			BladeMasters.balances.$skill =  ( parseFloat(BladeMasters.balances.skill , 8 ) * parseFloat(BladeMasters.marketPrices.skill , 8 ) ).toFixed(2);
			
			
			/* set these prices into the header */
			document.querySelector('.bnb-price').innerText = "$" + BladeMasters.marketPrices.bnb
			document.querySelector('.skill-price').innerText = "$" + BladeMasters.marketPrices.skill
			document.querySelector('.skill-balance').innerText = "( $" + BladeMasters.balances.$skill + " ) "
			
			
			/* close modal */
			setTimeout(function() {

				var element = document.querySelector('.close');
				var event = new MouseEvent('click', {
				  'view': window,
				  'bubbles': true,
				  'cancelable': true
				});
				
				element.dispatchEvent(event);
			} ,  200)
			
		}, 600)
	}
	
	,
	
	/**
	 *
	 */
	checkIfBattlePage : function() {
		var currentPage = window.location.href.replace(window.location.origin + '/#/' , '');
		
		var isCombatPage = true;
		
		if (currentPage != 'combat') {
			isCombatPage = false;
		}
		
		if(document.querySelectorAll('.encounter-container').length <1 ) {
			isCombatPage = false;
		}
		
		if (isCombatPage) {
			document.querySelectorAll('.victory-chance').forEach(function( box ) {
				box.style.position = "relative"
			});
		}
		
		return isCombatPage;
		
	}
	
	,
	
	getElementCode : function(element) {
		
		BladeMasters.traitMap.earth = 0
		BladeMasters.traitMap.lightning = 1
		BladeMasters.traitMap.water = 2
		BladeMasters.traitMap.fire = 3
		BladeMasters.traitMap.power = 4
		
		return BladeMasters.traitMap[element.toLowerCase().trim()];
	}
	
	,
	
	getAttrElement : function( attr ) {
			switch(element.toUpperCase()) {
			case "DEX":
				return 0;
				break;
			case "CHA":
				return 1;
				break;
			case "INT":
				return 2;
				break;
			case "STR":
				return 3;
				break;
			case "PWR":
				return 4;
				break;
		}
	}
	
	,
	
	/**
	 *
	 */
	loadCharacter : function() {
		
		this.character.name = document.querySelector(".character-data-column .name").innerText;
		
		this.character.element = this.getElementCode(document.querySelector(".character-data-column .trait-icon")._prevClass.replace("-icon trait-icon" , ""));
		
		this.character.power = parseInt(document.querySelector(".character-data-column .subtext-stats").children[3].innerText.replace("," , ""))
		
	}
	
	,
	
	/**
	 *
	 */
	loadWeapon : function() {
		
		this.weapon.name = document.querySelector('.weapon-selection .name').innerText;
		
		this.weapon.element = this.getElementCode(document.querySelector('.weapon-selection .trait').children[0].className.replace("-icon" , ""));
		
		this.getWeaponAttributes(this.weapon.name);
		
	}
	
	,
	
	getWeaponAttributes : function( name ) {
		
		/* set defaults */
		this.weapon.stat = []; 
		this.weapon.bonusPower = 0; 
		
		this.weapon.stat[1] = {
			element : 1,
			power : 0
		}
		
		this.weapon.stat[2] = {
			element : 1,
			power : 0
		} 
		
		this.weapon.stat[3] = {
			element : 1,
			power : 0
		} 
		
		/* if no weapon tooltip is detected then bail */
		if(!document.querySelector('.tooltip-inner')) {
			return;
		}
		
		
		var element = document.querySelector('.weapon-icon');
		var event = new MouseEvent('mouseenter', {
		  'view': window,
		  'bubbles': true,
		  'cancelable': true
		});

		element.dispatchEvent(event);

		var statsRaw = document.querySelector('.tooltip-inner').innerText;
		
		/* parse raw text by new line */
		var statsParsed = statsRaw.split(/\r?\n/);
		
		if (statsParsed.length < 2 ) {
			return;
		}

		var count = 1;
		for ( lineItem of statsParsed ) {
			//console.log(lineItem);
			var traitParts = lineItem.split(":")
			
			if (typeof(traitParts[1]) == "undefined") {
				continue; 
			}
			
			if (!traitParts[1].match(/\d+/)) {
				continue; 
			}
			
			switch (traitParts[0]) {
				case "★":
				case "★★":
				case "★★★":
				case "★★★★":
				case "★★★★★":
				case "ID":
				case "LB":
				case "4B":
					continue
					break;
				case "INT" :
					this.weapon.stat[count].element = this.getElementCode("water");
					break;
				case "STR":
					this.weapon.stat[count].element = this.getElementCode("fire");
					break;
				case "CHA":
					this.weapon.stat[count].element = this.getElementCode("lightning");
					break;
				case "DEX":
					this.weapon.stat[count].element = this.getElementCode("lightning");
					break;
				case "PWR":
				case "Bonus power":
					this.weapon.bonusPower = this.weapon.bonusPower +  parseInt(traitParts[1].match(/\d+/).pop().trim());
					continue;
					break;
					
			}
			
			BladeMasters.weapon.stat[count].power = parseInt(traitParts[1].match(/\d+/).pop().trim());
			
			count++;
			
		}
	

	}
	
	,
	
	loadEnemies : function() {
		
		BladeMasters.enemies = BladeMasters.enemies ? BladeMasters.enemies : []
		
		var enemyContainers = document.querySelectorAll('.encounter-container');

		/* loop through containers and build enemy profiles */
		count = 1;
		enemyContainers.forEach( function(enemy) {
			
			/* add % containers into enemy cards if they do not exist yet */
			if (!enemy.querySelector('.enemy'+count+'Chance')) {
				enemy.querySelector('.victory-chance').innerHTML = enemy.querySelector('.victory-chance').innerHTML + "<div class='enemy"+count+"Chance'></div>";
			}
			
			/* create enemy profile */
			BladeMasters.enemies[count] = {}
			
			BladeMasters.enemies[count].element = BladeMasters.getElementCode(enemy.querySelector('.encounter-element').children[0].className.replace('-icon' , ''));
			//console.log('count ' + count);
			BladeMasters.enemies[count].power = parseInt(enemy.querySelector('.encounter-power').innerText.replace(" Power " , "" )); 
			
			count++;
		});
	}
	
	, 
	/**
	 *
	 * 
	 */
	calculateBattle : function() {
		 	
		 	function t(t, a, e) {
		        let i = 1;
		        var r, n;
		        return t == a && (i += .075),
		        n = e,
		        ((r = t) == BladeMasters.traitMap.fire && n == BladeMasters.traitMap.earth || r == BladeMasters.traitMap.water && n == BladeMasters.traitMap.fire || r == BladeMasters.traitMap.lightning  && n == BladeMasters.traitMap.water || r == BladeMasters.traitMap.earth && n == BladeMasters.traitMap.lightning) && (i += .075),
		        function(t, a) {
		            return t == BladeMasters.traitMap.fire && a == BladeMasters.traitMap.water || t == BladeMasters.traitMap.water && a == BladeMasters.traitMap.lightning || t == BladeMasters.traitMap.lightning && a == BladeMasters.traitMap.earth || t == BladeMasters.traitMap.earth && a == BladeMasters.traitMap.fire
		        }(t, e) && (i -= .075),
		        i
		    }
		    function a(t, a) {
		        return t = Math.ceil(t),
		        a = Math.floor(a),
		        Math.floor(Math.random() * (a - t + 1)) + t
		    }
		 	
            let e = parseInt(BladeMasters.character.element)
              , i = parseInt(BladeMasters.weapon.element)
              , r = parseInt(BladeMasters.weapon.stat[1].element)
              , n = parseInt(BladeMasters.weapon.stat[2].element)
              , o = parseInt(BladeMasters.weapon.stat[3].element)
              , s = parseInt(BladeMasters.enemies[1].element)
              , p = parseInt(BladeMasters.enemies[2].element)
              , c = parseInt(BladeMasters.enemies[3].element)
              , d = parseInt(BladeMasters.enemies[4].element);
            !function(e, i, r, n, o, s, p, c, d, l, h, T, w, u, g, f, v, k) {
                let m, b, I = function(t, a, e, i, r, n, o) {
                    let s = 1;
                    a > 0 && e >= 0 && (s += e == t ? .0026750000000000003 * a : e == BladeMasters.traitMap.power ? .002575 * a : .0025 * a);
                    i > 0 && r >= 0 && (s += r == t ? .0026750000000000003 * i : r == BladeMasters.traitMap.power ? .002575 * i : .0025 * i);
                    n > 0 && o >= 0 && (s += o == t ? .0026750000000000003 * n : o == BladeMasters.traitMap.power ? .002575 * n : .0025 * n);
                    return s
                }(n, o, s, p, c, d, l), y = e * I + r, x = Math.ceil(h - .1 * h), M = Math.floor(h + .1 * h), W = Math.ceil(y - .1 * y), P = Math.floor(y + .1 * y), F = Math.ceil(w - .1 * w), E = Math.floor(w + .1 * w), C = Math.ceil(y - .1 * y), L = Math.floor(y + .1 * y), R = Math.ceil(g - .1 * g), B = Math.floor(g + .1 * g), H = Math.ceil(y - .1 * y), N = Math.floor(y + .1 * y), D = Math.ceil(v - .1 * v), A = Math.floor(v + .1 * v), G = Math.ceil(y - .1 * y), J = Math.floor(y + .1 * y), O = t(i, n, T), S = t(i, n, u), U = t(i, n, f), _ = t(i, n, k), j = 0, q = 0, z = 0, K = 0;
                for (let t = 0; t < 500; t++)
                    m = a(W, P) * O,
                    b = a(x, M),
                    m >= b && j++,
                    m = a(C, L) * S,
                    b = a(F, E),
                    m >= b && q++,
                    m = a(H, N) * U,
                    b = a(R, B),
                    m >= b && z++,
                    m = a(G, J) * _,
                    b = a(D, A),
                    m >= b && K++;
                    
                document.querySelector(".enemy1Chance").innerText = (j / 500 * 100).toFixed(2) + " %",
                document.querySelector(".enemy2Chance").innerText = (q / 500 * 100).toFixed(2) + " %",
                document.querySelector(".enemy3Chance").innerText = (z / 500 * 100).toFixed(2) + " %",
                document.querySelector(".enemy4Chance").innerText = (K / 500 * 100).toFixed(2) + " %"
                
            }( BladeMasters.character.power, e, BladeMasters.weapon.bonusPower, i, BladeMasters.weapon.stat[1].power, r, BladeMasters.weapon.stat[2].power, n, BladeMasters.weapon.stat[3].power, o, BladeMasters.enemies[1].power, s, BladeMasters.enemies[2].power, p, BladeMasters.enemies[3].power, c, BladeMasters.enemies[4].power, d)
        
	}

}

setTimeout(function() {
	setInterval(function() {
		
		/* Start Routine Checks */
		BladeMasters.checkBattleStats();
		
	} , 1000 );
	
	/* prevent delay on first run */
	BladeMasters.checkBattleStats();
	
	/* annouce to console that BladeMasterJS is loaded */
	console.log('BladeMasterJS loaded');
} , 2000 )



