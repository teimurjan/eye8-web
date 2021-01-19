import { GetServerSideProps } from 'next';

const forceSSR: GetServerSideProps = () => Promise.resolve({ props: {} });

export default forceSSR;
