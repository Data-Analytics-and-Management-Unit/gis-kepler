import {Provider} from 'react-redux';
import store from '../components/redux/store';
import { QueryClient, QueryClientProvider } from "react-query";

import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import '../styles/globals.css';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }) {
  return ( 
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </QueryClientProvider>
  )
}

export default MyApp
