// old perlin noise that I used in the past.
export default function perlinNoise(SEED) {
	var seed = SEED;
	var size = 256;
	var values = new Array();
	for(var i =0;i< size*2;i++)
		values[i] =  Math.floor(100*Math.random());
	
	function Fade(t){
		return t*t*t*(t*(t*6-15)+10);
	}
	function Lerp(t,a,b){
		return a+t*(b-a);
	}
	function Grad(hash,x,y){
	  var h = hash;
		var u = x;
		if(hash%4==1||hash%4==2)
			u = -x;
		var v = y;
		if(hash%2==0)
			v = -y;
		return u  + v;
	}
	function Noise(X,Y){
		X /= 10;
		Y /= 10;
		var x = Math.floor(X%(size/2));
		var y = Math.floor(Y%(size/2));
		X -= x;
    Y -= y;
		var u = Fade(X);
    var v = Fade(Y);
		var A = values[x] + y;
		var B = values[x+1] + y;
		
    return Lerp(v, 
      Lerp(u, 
        Grad(values[A],X,Y),
		    Grad(values[B],X-1,Y)),
      Lerp(u,
        Grad(values[A+1],X,Y-1),
        Grad(values[B+1],X-1,Y-1))
    );
	}
	return  {
		getHeight : function(x,y){
      return Noise(x,y);
    }
	};
}