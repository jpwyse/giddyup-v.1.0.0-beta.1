import * as React from 'react';
import Box from '@mui/material/Box';

const OptionsIcon = () => {
  return (
    <React.Fragment>
      <Box
        component="img"
        sx={{
          height: 40,
          width: 40,
        }}
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAABgUlEQVR4nO3Zy26CYBSFUd7/tWrfac9O0+iIAdFKZYtrJQ4N+H8c5LIsAAAAPCyZ72Quj3+Tf5HM/H4sb4kI0iWCdIkgXSJIlwjSJYJ0iSBdIkiXCNIlgnSJIOcMkutDyrnz42HmC4LcG8PDzC2ClIkJ6RJBukSQrquVCNJ1tRJBBMk7vcM3IWUEKSNIGUHKCFJGkDKClBGkjCBlBCkjSBlByghS9l7j04LkVe9/ntjBTwsyL/m99Tt4I4ggY0I2mBATMiZkgwkxIWNCNpgQEzImZMNed8719131O3iz1/brf2/9Dt4cvbCCrBy9sIKsHL2wgqwcvbCnDZInr44EKTnSUrL9M07ICCLImBAT8jdOWeM/JP7UTchy0BnBKStdV4eCRBD3ITEhy7tcHTpl5f2DXB7Y0NeB35vVAr3Ffp9Wnj3y2FcE6RJBukSQLhGkSwTpEkG6RJAuEaRLBOkSQbpEkC4RpEsE6RJBukSQLhGkSwTpkusr1PO/GgUAAFj29wOE9e3oUofd8AAAAABJRU5ErkJggg=="
      />
    </React.Fragment>
  );
};

export default OptionsIcon;
