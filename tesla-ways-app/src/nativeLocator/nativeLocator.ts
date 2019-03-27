import { Geolocation } from '@ionic-native/geolocation';

export class NativeLocator {

   // constructor(private geolocation: Geolocation) {}

   geolocation : Geolocation;

   constructor() {
       this.geolocation = new Geolocation();
   }
    locate() : {lat:number, long:number} {


        this.geolocation.getCurrentPosition().then((resp) => {
            let lat =  resp.coords.latitude;
            let long = resp.coords.longitude;
            console.log("[U native locatoru]: " + lat + " " + long);
            
            return ({lat:lat, long:long});
            }).catch((error) => {
                console.log(error.message);
                return {lat:-2, long:-2};
            });

            return {lat:-1, long:-1}; 
    }

    watch() : {lat:string, long:string} {

        let watch = this.geolocation.watchPosition();
        watch.subscribe((data) => {
        // data can be a set of coordinates, or an error (if an error occurred). 
         return {lat:data.coords.latitude, long:data.coords.longitude};
        });

        return {lat:"Generic", long:"Generic"};
    }
}

