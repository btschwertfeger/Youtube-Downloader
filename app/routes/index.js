/*
<!--
    ########################################
    ## @author Benjamin Thomas Schwertfeger (2021)
    ## https://github.com/Crynetomega/Youtube-Downloader
    ############
-->
*/

/* * * * ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- * * * * 
 * * * ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- * * * 
 * * * -----> I M P O R T S <----- ----- ----- */

const
    router = require("express").Router(),
    ytdl = require("ytdl-core"),
    contentDisposition = require('content-disposition');

/* * * * ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- * * * * 
 * * * ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- * * * 
 * * * -----> R O U T E S <----- ----- ----- */

router.get("/download", (req, res) => {
    const query = req.query;

    if (typeof query.type === "undefined" || typeof query.URL === "undefined") res.status(404).end();
    else if (query.type !== "mp3" && query.type !== "mp4") res.status(401).end();
    else {
        ytdl(query.URL, {
            format: query.type
        }).on("info", info => {
            const title = info.videoDetails.title;
            res.header("Content-Disposition", contentDisposition(`${title}.${query.type}`));
            res.header('Content-Transfer-Encoding', 'binary');
            res.header('Content-Type', 'application/octet-stream')

            if (typeof req.session.downloads === "undefined" || !req.session.downloads || req.session.downloads.length === 0) req.session.downloads = [];
            req.session.downloads.push({
                title: title,
                url: query.URL,
                type: query.type
            });
        }).pipe(res);
    }
});

/* * * * ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- * * * * 
 * * * ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- * * * 
 * * * -----> E X P O R T<----- ----- ----- */

module.exports = router;

/* * * * ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- * * * * 
 * * * ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- * * * 
 * * * -----> E O F <----- ----- ----- */