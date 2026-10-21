package com.gestionut.conductor.ui.screens.viaje;

import androidx.lifecycle.SavedStateHandle;
import com.gestionut.conductor.data.repository.ViajeRepository;
import dagger.internal.DaggerGenerated;
import dagger.internal.Factory;
import dagger.internal.QualifierMetadata;
import dagger.internal.ScopeMetadata;
import javax.annotation.processing.Generated;
import javax.inject.Provider;

@ScopeMetadata
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
public final class ViajeActivoViewModel_Factory implements Factory<ViajeActivoViewModel> {
  private final Provider<ViajeRepository> viajeRepositoryProvider;

  private final Provider<SavedStateHandle> savedStateHandleProvider;

  public ViajeActivoViewModel_Factory(Provider<ViajeRepository> viajeRepositoryProvider,
      Provider<SavedStateHandle> savedStateHandleProvider) {
    this.viajeRepositoryProvider = viajeRepositoryProvider;
    this.savedStateHandleProvider = savedStateHandleProvider;
  }

  @Override
  public ViajeActivoViewModel get() {
    return newInstance(viajeRepositoryProvider.get(), savedStateHandleProvider.get());
  }

  public static ViajeActivoViewModel_Factory create(
      Provider<ViajeRepository> viajeRepositoryProvider,
      Provider<SavedStateHandle> savedStateHandleProvider) {
    return new ViajeActivoViewModel_Factory(viajeRepositoryProvider, savedStateHandleProvider);
  }

  public static ViajeActivoViewModel newInstance(ViajeRepository viajeRepository,
      SavedStateHandle savedStateHandle) {
    return new ViajeActivoViewModel(viajeRepository, savedStateHandle);
  }
}
