using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Net.Http.Headers;

namespace ChatWeb.Controllers
{
    [Route("Api/[controller]/[action]")]
    [EnableCors("CorsPolicy")]
    public class UploadController : Controller
    {
        private readonly IHostingEnvironment _hostingEnvironment;

        public UploadController(IHostingEnvironment hostingEnvironment)
        {
            _hostingEnvironment = hostingEnvironment;
        }

        [HttpPost]
        public void Image(IFormFile file)
        {
            string filename = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.ToString().Trim('"');

            filename = EnsureCorrectFilename(filename);

            using (FileStream output = System.IO.File.Create(GetPathAndFilename(filename)))
            {
                file.CopyTo(output);
            }

            return;
        }

        private string EnsureCorrectFilename(string filename)
        {
            if (filename.Contains("\\"))
            {
                filename = filename.Substring(filename.LastIndexOf("\\") + 1);

            }

            return filename;
        }

        private string GetPathAndFilename(string filename)
        {
            string path = _hostingEnvironment.WebRootPath + "\\uploads\\";

            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }

            return path + filename;
        }
    }
}
