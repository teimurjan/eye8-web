import { extractCritical } from 'emotion-server';
import Document, { Head, Main, NextScript, DocumentContext } from 'next/document';
import * as React from 'react';

class CustomNextDocument extends Document<{ locale: string; localeDataScript: string }> {
  static async getInitialProps(context: DocumentContext) {
    const props = await super.getInitialProps(context);

    const page = await context.renderPage();
    const styles = extractCritical(page.html);

    return {
      ...props,
      ...page,
      ...styles,
      locale: (context.req as any).locale,
      localeDataScript: (context.req as any).localeDataScript,
    };
  }

  render() {
    const { ids, css } = this.props as any;

    const polyfill = `https://cdn.polyfill.io/v3/polyfill.min.js?features=Intl.~locale.${this.props.locale}`;

    return (
      <html>
        <Head>
          <style data-emotion-css={ids.join(' ')} dangerouslySetInnerHTML={{ __html: css }} />
        </Head>
        <body>
          <Main />
          <script src={polyfill} />
          <script
            dangerouslySetInnerHTML={{
              __html: this.props.localeDataScript,
            }}
          />
          <NextScript />
          <div id="modalRoot"></div>
          <div id="toastRoot"></div>
          <div id="popoverRoot"></div>
          <div id="drawerRoot"></div>
          <div id="cacheBusterRoot"></div>
        </body>
      </html>
    );
  }
}

export default CustomNextDocument;
