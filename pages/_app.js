import {Provider} from 'react-redux';
import store from '../components/redux/store';

import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return ( 
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  )
}

export default MyApp
