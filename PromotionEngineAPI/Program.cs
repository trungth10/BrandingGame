using ApplicationCore.Worker;
using AutoMapper;
using Firebase.Auth;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Threading.Tasks;

namespace PromotionEngineAPI
{
    public class Program
    {
        //API key firebase
        //private const string API_KEY = "AIzaSyDSEYqnQqemcl0nQcsYtSbj4n_Dgbc8avU";
        public static async Task Main(string[] args)
        {
            //FirebaseAuthProvider firebaseAuthProvider = new FirebaseAuthProvider (new FirebaseConfig(API_KEY));
            //create account gmail firebase
            //FirebaseAuthLink firebaseAuthLink = await firebaseAuthProvider.CreateUserWithEmailAndPasswordAsync("trungsk@gmail.com", "test123", "Trung");
            //login
            //FirebaseAuthLink firebaseAuthLink = await firebaseAuthProvider.SignInWithEmailAndPasswordAsync("trungsk@gmail.com", "test123");
            //FirebaseAuthLink firebaseAuthLink = await firebaseAuthProvider.CreateUserWithEmailAndPasswordAsync("dattq@gmail.com", "test1234", "Dat");

            //Console.WriteLine(firebaseAuthLink.FirebaseToken);

            using var host = Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                })
               .ConfigureServices((hostContext, services) =>
               {
                   #region snippet3
                   services.AddSingleton<VoucherWorker>();
                   services.AddHostedService<QueuedHostedService>();
                   services.AddSingleton<IBackgroundTaskQueue, BackgroundTaskQueue>();
                   #region automapper configure
                   var mapperConfig = new MapperConfiguration(mc =>
                   {
                       mc.AddProfile(new Infrastructure.AutoMapper.AutoMapper());
                   });
                   IMapper mapper = mapperConfig.CreateMapper();
                   services.AddSingleton(mapper);
                   #endregion
                   #endregion
               })
               .Build();
            await host.StartAsync();
            await host.WaitForShutdownAsync();
        }

        //public static IHostBuilder CreateHostBuilder(string[] args) =>
        //    Host.CreateDefaultBuilder(args)
        //        .ConfigureWebHostDefaults(webBuilder =>
        //        {
        //            webBuilder.UseStartup<Startup>();
        //        })
        //        .ConfigureServices(services =>
        //        {
        //            services.AddSingleton<MonitorLoop>();
        //            services.AddHostedService<QueuedHostedService>();
        //            services.AddSingleton<IBackgroundTaskQueue, BackgroundTaskQueue>();
        //        });
    }
}
