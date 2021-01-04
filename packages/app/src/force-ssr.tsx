import { GetServerSideProps } from 'next';

export const forceSSR: GetServerSideProps = () => Promise.resolve({ props: {} });
