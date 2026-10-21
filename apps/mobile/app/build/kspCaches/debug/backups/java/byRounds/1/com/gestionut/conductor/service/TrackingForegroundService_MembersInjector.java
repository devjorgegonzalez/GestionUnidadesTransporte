package com.gestionut.conductor.service;

import com.gestionut.conductor.data.repository.ViajeRepository;
import dagger.MembersInjector;
import dagger.internal.DaggerGenerated;
import dagger.internal.InjectedFieldSignature;
import dagger.internal.QualifierMetadata;
import javax.annotation.processing.Generated;
import javax.inject.Provider;

@QualifierMetadata
@DaggerGenerated
@Generated(
    value = "dagger.internal.codegen.ComponentProcessor",
    comments = "https://dagger.dev"
)
@SuppressWarnings({
    "unchecked",
    "rawtypes",
    "KotlinInternal",
    "KotlinInternalInJava",
    "cast"
})
public final class TrackingForegroundService_MembersInjector implements MembersInjector<TrackingForegroundService> {
  private final Provider<ViajeRepository> viajeRepositoryProvider;

  public TrackingForegroundService_MembersInjector(
      Provider<ViajeRepository> viajeRepositoryProvider) {
    this.viajeRepositoryProvider = viajeRepositoryProvider;
  }

  public static MembersInjector<TrackingForegroundService> create(
      Provider<ViajeRepository> viajeRepositoryProvider) {
    return new TrackingForegroundService_MembersInjector(viajeRepositoryProvider);
  }

  @Override
  public void injectMembers(TrackingForegroundService instance) {
    injectViajeRepository(instance, viajeRepositoryProvider.get());
  }

  @InjectedFieldSignature("com.gestionut.conductor.service.TrackingForegroundService.viajeRepository")
  public static void injectViajeRepository(TrackingForegroundService instance,
      ViajeRepository viajeRepository) {
    instance.viajeRepository = viajeRepository;
  }
}
